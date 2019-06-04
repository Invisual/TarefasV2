const express = require('express');
const router = express.Router();
const connection = require('../../dbconnect');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
var moment = require('moment');
require('dotenv').config();
require('moment/locale/pt');

router.use(cors());

var SECRET_KEY = process.env.SECRET_KEY;
var checkToken = require('./checkToken');

router.get('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_client, name_client, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS total_hours, monthly_hours_client FROM clients LEFT JOIN tasks ON clients.id_client=tasks.ref_id_client LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task group by id_client',
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          }
        }
      );
    }
  });
});


router.get('/annual/:id', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      var totalResults = [];
      var counter = 1;
      for (var i = 1; i < 13; i++) {
        tVal = i;//some manipulation of someArr[i]
         (function(val){
           connection.query( 'SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS total_hours FROM clients LEFT JOIN tasks ON clients.id_client=tasks.ref_id_client LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task WHERE id_client=? AND MONTH(day)=?',
           [req.params.id, i], function(err, results, fields) {
               if ( err ) {
                 console.log( err );
               } else {
                var obj = {}
                obj.mes = moment(val, 'M').format('MMMM')
                obj.horas = results[0].total_hours !== null ? 
                              moment(results[0].total_hours, 'HH:mm:ss').format('HH') < 01 ?
                                    moment(results[0].total_hours, 'HH:mm:ss').format('mm') > 01 ?
                                      parseInt(results[0].total_hours, 10)+1 
                                    : parseInt(results[0].total_hours, 10) 
                                : moment(results[0].total_hours, 'HH:mm:ss').format('mm') > 30 ?
                                parseInt(results[0].total_hours, 10)+1 
                              : parseInt(results[0].total_hours, 10) 
                            : 0
                
                totalResults.push(obj)
               }
               if(val === 12){
                  sendResults(totalResults)
              }
           });
         })(tVal);
      }
      function sendResults(results){
        res.send(totalResults)
      }
    }
  });
});

router.get('/basic', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('Select id_client, name_client, monthly_hours_client from clients ORDER BY name_client ASC', function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        }
      });
    }
  });
});



router.get('/basic/:client', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('Select id_client, name_client, monthly_hours_client from clients WHERE id_client = ?', req.params.client, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        }
        else{
          res.send('noclient')
        }
      });
    }
  });
});



router.get('/details/:client', checkToken, (req, res) => {

  var id = req.params.user;
  var client = req.params.client;
  var totalResults = {};
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('SELECT * FROM clients WHERE id_client=?', client, function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          totalResults.details = results;
        }
      });
      connection.query(
        "SELECT title_project, id_project, name_client, concluded_project, SUM(CASE WHEN tasks.id_task THEN 1 ELSE 0 END) AS total_tasks, COUNT(DISTINCT(tasks.concluded_task=1)) AS concluded_tasks, SUM(case WHEN tasks.concluded_task=1 THEN 1 ELSE 0 END)/count(*) *100 AS percentage_tasks, GROUP_CONCAT(DISTINCT CONCAT(users.id_user,',',users.name_user,',',users.avatar_user) SEPARATOR ';') as intervenientes FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task LEFT JOIN users ON users_has_tasks.ref_id_user= users.id_user LEFT JOIN clients ON projects.ref_id_client = clients.id_client WHERE projects.ref_id_client=? GROUP BY id_project",
        client,
        function(error, results, fields) {
          if (error) throw error;
          if (totalResults.details[0].id_client !== null) {
            totalResults.projects = results;
          } else {
            res.send('nodata');
          }
        }
      );
      connection.query(
        'SELECT id_task, title_task, ref_id_user_task_status, id_user, avatar_user, name_user FROM tasks LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task LEFT JOIN users ON users_has_tasks.ref_id_user= users.id_user WHERE tasks.ref_id_client=?',
        client,
        function(error, results, fields) {
          if (error) throw error;
          totalResults.tasks = results;
          if (totalResults.details[0].id_task !== null) {
            res.send(totalResults);
          } else {
            res.send('nodata');
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
      connection.query('INSERT INTO clients (name_client, monthly_hours_client) VALUES (?,?)',
      [req.body.clientName, req.body.clientHours],
      function(error, results, fields) {
        if (error) throw error;
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
      connection.query('UPDATE clients SET name_client = ?, monthly_hours_client = ? WHERE id_client = ?',
      [req.body.clientName, req.body.clientHours, req.body.id],
      function(error, results, fields) {
        if (error) throw error;
        res.send(results);
      });
    }
  });
});


router.put('/details', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('UPDATE clients SET cpanel_username_client = ?, cpanel_password_client = ?, dns_nichandle_client = ?, dns_password_client = ?, wordpress_link_client = ?, wordpress_username_client = ?, wordpress_password_client = ?, email_client = ?, others_client = ?, cpanel_link_client = ? WHERE id_client = ?',
      [req.body.cpanelUser, req.body.cpanelPass, req.body.dnsNic, req.body.dnsPass, req.body.wpLink, req.body.wpUser, req.body.wpPass, req.body.emails, req.body.others, req.body.cpanelLink, req.body.id],
      function(error, results, fields) {
        if (error) throw error;
        res.send(results);
      });
    }
  });
});

module.exports = router;
