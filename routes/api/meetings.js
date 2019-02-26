const express = require('express');
const router = express.Router();
const connection = require('../../dbconnect');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

router.use(cors());

var SECRET_KEY = process.env.SECRET_KEY;
var checkToken = require('./checkToken');

router.get('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('SELECT id_meeting, title_meeting as title, place_meeting, date_meeting as start, date_meeting as end , ref_id_clients, start_hour_meeting, end_hour_meeting, type_meeting, name_client, GROUP_CONCAT(DISTINCT CONCAT(users.id_user,",",users.name_user,",",users.avatar_user) SEPARATOR ";") as intervenientes from meetings INNER JOIN meetings_has_users ON meetings_has_users.ref_id_meeting=meetings.id_meeting LEFT JOIN users on meetings_has_users.ref_id_user = users.id_user  LEFT JOIN clients ON meetings.ref_id_clients = clients.id_client GROUP BY id_meeting ORDER BY start ASC', function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        }
      });
    }
  });
});


router.get('/basic/:id', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        "SELECT *, GROUP_CONCAT(DISTINCT CONCAT(meetings_has_users.ref_id_user) SEPARATOR ',') as intervenientes from meetings INNER JOIN meetings_has_users ON meetings.id_meeting=meetings_has_users.ref_id_meeting WHERE id_meeting=? GROUP BY id_meeting",
        req.params.id,
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          }
          else{
            res.send('nomeeting');
          }
        }
      );
    }
  });
});



router.get('/:user', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_meeting, title_meeting as title, place_meeting, date_meeting as start, date_meeting as end , ref_id_clients, start_hour_meeting, end_hour_meeting, type_meeting, name_client, GROUP_CONCAT(DISTINCT CONCAT(users.id_user,",",users.name_user,",",users.avatar_user) SEPARATOR ";") as intervenientes from meetings INNER JOIN meetings_has_users ON meetings_has_users.ref_id_meeting=meetings.id_meeting LEFT JOIN users on meetings_has_users.ref_id_user = users.id_user  LEFT JOIN clients ON meetings.ref_id_clients = clients.id_client WHERE CURDATE() <= date_meeting  GROUP BY id_meeting HAVING FIND_IN_SET(?, intervenientes)',
        req.params.user,
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          }
          else{
            res.send('nomeeting')
          }
        }
      );
    }
  });
});



router.post('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('INSERT INTO meetings (title_meeting, place_meeting, date_meeting, ref_id_clients, start_hour_meeting, end_hour_meeting, type_meeting) VALUES (?,?,?,?,?,?,?)',
      [req.body.topic, req.body.place, req.body.date, req.body.client, req.body.startHour, req.body.endHour, req.body.placeType],
      function(error, results, fields) {
        if (error) throw error;
        for(var i=0, count=req.body.users.length; i<count; i++){
          connection.query('INSERT INTO meetings_has_users (ref_id_meeting, ref_id_user) VALUES (?,?)', [results.insertId, req.body.users[i]],
          function(error, results2, fields){
            if (error) throw error;
          })
        }
        res.send(results);
      });
    }
  });
});



router.put('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('UPDATE meetings SET title_meeting = ?, place_meeting = ?, date_meeting = ?, ref_id_clients = ?, start_hour_meeting = ?, end_hour_meeting = ?, type_meeting = ? WHERE id_meeting = ?',
      [req.body.topic, req.body.place, req.body.date, req.body.client, req.body.startHour, req.body.endHour, req.body.placeType, req.body.id],
      function(error, results, fields) {
        if (error) throw error;
        connection.query('DELETE FROM meetings_has_users WHERE ref_id_meeting = ?', req.body.id,
        function(error, results2, fields){
          if (error) throw error;
          for(var i=0, count=req.body.users.length; i<count; i++){
            connection.query('INSERT INTO meetings_has_users (ref_id_meeting, ref_id_user) VALUES (?,?)', [req.body.id, req.body.users[i]],
            function(error, results2, fields){
              if (error) throw error;
            })
          }
        })
        res.send(results);
      });
    }
  });
});


module.exports = router;
