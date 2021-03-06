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
      connection.query("SELECT title_project, id_client, name_client, id_project, creation_date_project, deadline_project, group_concat(DISTINCT projects_has_categories.ref_id_category SEPARATOR ',') as 'categories', projects.ref_id_billing_mode, concluded_project, billed_project, projects.ref_id_user_account, COUNT(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE NULL END) AS total_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE (ref_id_user_task_status = 2 OR ref_id_user_task_status = 3) AND tasks.ref_id_project = id_project) as doing, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project) AS concluded_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project)/count(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE 0 END) *100 AS percentage_tasks, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task INNER JOIN clients ON clients.id_client=projects.ref_id_client LEFT JOIN projects_has_categories ON projects.id_project=projects_has_categories.ref_id_project WHERE concluded_project = 0 group by projects.id_project ORDER BY deadline_project ASC",
      function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        } else {
          res.send('nodata')
        }
      }
    );
  }
});
});

router.put('/undo', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'UPDATE projects SET concluded_project=0, billed_project=NULL, comment_billed_project=NULL, user_billed_project = NULL, conclusion_date_project = NULL WHERE id_project=?', req.body.id,
        function (error, results, fields) {
          if (error) throw error;
          connection.query(
            'UPDATE tasks SET concluded_task=0, billed_task=NULL, conclusion_date_task = NULL WHERE ref_id_project=?', req.body.id,
            function (error, results, fields) {
              if (error) throw error;
              res.send(results)
            }
          );
        }
      );
      
    }
  });
});

router.get('/concluded', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query("SELECT title_project, id_client, name_client, id_project, creation_date_project, deadline_project, group_concat(DISTINCT projects_has_categories.ref_id_category SEPARATOR ',') as 'categories', projects.ref_id_billing_mode, concluded_project, billed_project, projects.ref_id_user_account, COUNT( DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE NULL END) AS total_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE (ref_id_user_task_status = 2 OR ref_id_user_task_status = 3) AND tasks.ref_id_project = id_project) as doing, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project) AS concluded_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project)/count(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE 0 END) *100 AS percentage_tasks, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task INNER JOIN clients ON clients.id_client=projects.ref_id_client LEFT JOIN projects_has_categories ON projects.id_project=projects_has_categories.ref_id_project WHERE concluded_project = 2 group by projects.id_project",
      function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        } else {
          res.send('nodata')
        }
      }
    );
  }
});
});


router.get('/basic', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('Select id_project, title_project, ref_id_client, ref_id_billing_mode from projects WHERE concluded_project = 0', function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
        }
      });
    }
  });
});


router.post('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('INSERT INTO projects (title_project, briefing_project, deadline_project, ref_id_billing_mode, ref_id_client, ref_id_user_account) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.title, req.body.briefing, req.body.deadline, req.body.billing, req.body.client, req.body.account],
        function(error, results, fields) {
        if (error) throw error;
          for(var i=0, count=req.body.categories.length; i<count; i++){
            connection.query('INSERT INTO projects_has_categories (ref_id_project, ref_id_category) VALUES (?,?)', [results.insertId, req.body.categories[i]],
            function(error, results2, fields){
              if (error) throw error;
            })
          }
          res.send(results)
      });
    }
  });
})

router.delete('/:id', checkToken, (req, res) => {
  var id = req.params.id;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('DELETE FROM costs WHERE ref_id_project=?', id, function(error, results, fields) {
        if (error) throw error;
      });
      connection.query('DELETE FROM projects WHERE id_project=?', id, function(error, results, fields) {
        if (error) throw error;
        res.send('deleted');
      });
    }
  });
});

router.get('/:user', checkToken, (req, res) => {
  var id = req.params.user;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        //"SELECT *, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' from tasks INNER JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task INNER JOIN projects ON tasks.ref_id_project=projects.id_project group by projects.id_project HAVING  FIND_IN_SET( ? , intervenientes)",

        "SELECT title_project, id_client, name_client, id_project, creation_date_project, deadline_project, group_concat(DISTINCT projects_has_categories.ref_id_category SEPARATOR ',') as 'categories', projects.ref_id_billing_mode, concluded_project, projects.ref_id_user_account, COUNT(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE NULL END) AS total_tasks, COUNT(DISTINCT CASE WHEN users_has_tasks.ref_id_user_task_status=2 THEN ref_id_user_task_status ELSE NULL END) as doing, COUNT(DISTINCT CASE WHEN users_has_tasks.ref_id_user_task_status=4 THEN ref_id_user_task_status ELSE NULL END) AS concluded_tasks, COUNT(DISTINCT CASE WHEN users_has_tasks.ref_id_user_task_status=4 THEN ref_id_user_task_status ELSE NULL END)/count(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE 0 END) *100 AS percentage_tasks, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' from tasks INNER JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task INNER JOIN projects ON tasks.ref_id_project=projects.id_project INNER JOIN clients ON clients.id_client=projects.ref_id_client LEFT JOIN projects_has_categories ON projects.id_project=projects_has_categories.ref_id_project WHERE concluded_project = 0 group by projects.id_project HAVING FIND_IN_SET(?, intervenientes)",
        id,
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata')
          }
        }
      );
    }
  });
});


router.get('/accounts/:user', checkToken, (req, res) => {
  var id = req.params.user;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        //"SELECT *, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' from tasks INNER JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task INNER JOIN projects ON tasks.ref_id_project=projects.id_project group by projects.id_project HAVING  FIND_IN_SET( ? , intervenientes)",

        "SELECT title_project, id_client, name_client, id_project, creation_date_project, deadline_project, group_concat(DISTINCT projects_has_categories.ref_id_category SEPARATOR ',') as 'categories', projects.ref_id_billing_mode, concluded_project, projects.ref_id_user_account, COUNT(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE NULL END) AS total_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE (ref_id_user_task_status = 2 OR ref_id_user_task_status = 3) AND tasks.ref_id_project = id_project) as doing, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project) AS concluded_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = id_project)/count(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE 0 END) *100 AS percentage_tasks, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'intervenientes' from tasks INNER JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task INNER JOIN projects ON tasks.ref_id_project=projects.id_project INNER JOIN clients ON clients.id_client=projects.ref_id_client LEFT JOIN projects_has_categories ON projects.id_project=projects_has_categories.ref_id_project WHERE concluded_project = 0 group by projects.id_project HAVING FIND_IN_SET(?, intervenientes) OR FIND_IN_SET(?, projects.ref_id_user_account) ORDER BY deadline_project ASC",
        [id, id],
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata')
          }
        }
      );
    }
  });
});


router.get('/basic/:id', checkToken, (req, res) => {
  var id = req.params.id;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        "SELECT *, GROUP_CONCAT(DISTINCT projects_has_categories.ref_id_category SEPARATOR ',') as 'categories' FROM projects INNER JOIN projects_has_categories ON projects.id_project = projects_has_categories.ref_id_project WHERE id_project = ?",
        id,
        function(error, results, fields) {
          if (error) throw error;
          if (results[0].id_project === null) {
            res.send('noproject');
          } else {
            res.send(results);
          }
        }
      );
    }
  });
});


router.put('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('UPDATE projects SET title_project = ?, briefing_project = ?, deadline_project = ?, ref_id_billing_mode = ?, ref_id_client = ?, ref_id_user_account = ?, zeplin_url = ?, slack_url = ? WHERE id_project = ?',
      [req.body.title, req.body.briefing, req.body.deadline, req.body.billing, req.body.client, req.body.account, req.body.zeplin, req.body.slack, req.body.id],
      function(error, results, fields) {
        if (error) throw error;
        connection.query('DELETE FROM projects_has_categories WHERE ref_id_project = ?', req.body.id,
        function(error, results2, fields){
          if (error) throw error;
          for(var i=0, count=req.body.categories.length; i<count; i++){
            connection.query('INSERT INTO projects_has_categories (ref_id_project, ref_id_category) VALUES (?,?)', [req.body.id, req.body.categories[i]],
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


router.get('/details/:project', checkToken, (req, res) => {
  var id = req.params.user;
  var project = req.params.project;
  var totalResults = {};
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        "SELECT title_project, (SELECT avatar_user from users INNER join projects ON users.id_user=projects.ref_id_user_account WHERE projects.id_project=?) as avatar_user ,(SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) from projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task WHERE id_project =?) as total_project_hours, creation_date_project, name_client, id_project, briefing_project, deadline_project, concluded_project, date_approved_project, user_approved_project, conclusion_date_project, user_concluded_project, zeplin_url, slack_url, (SELECT avatar_user from users INNER JOIN projects ON users.id_user = projects.user_approved_project WHERE projects.id_project=?) AS avatar_approved_user, (SELECT name_user from users INNER JOIN projects ON users.id_user = projects.user_approved_project WHERE projects.id_project=?) AS name_approved_user, (SELECT avatar_user from users INNER JOIN projects ON users.id_user = projects.user_concluded_project WHERE projects.id_project=?) AS avatar_concluded_user, (SELECT name_user from users INNER JOIN projects ON users.id_user = projects.user_concluded_project WHERE projects.id_project=?) AS name_concluded_user, projects.ref_id_billing_mode, name_billing_mode, COUNT(DISTINCT(project_comments.id_project_comment)) AS total_comments, COUNT(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE NULL END) AS total_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE (ref_id_user_task_status = 2 OR ref_id_user_task_status = 3) AND tasks.ref_id_project = ?) as doing, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = ?) AS concluded_tasks, (SELECT COUNT(ref_id_task) from users_has_tasks INNER JOIN tasks ON users_has_tasks.ref_id_task = tasks.id_task WHERE ref_id_user_task_status = 4 AND tasks.ref_id_project = ?)/count(DISTINCT CASE WHEN tasks.id_task THEN id_task ELSE 0 END) *100 AS percentage_tasks, group_concat(DISTINCT users_has_tasks.ref_id_user SEPARATOR ',') as 'user', GROUP_CONCAT(DISTINCT CONCAT(users.id_user,',',users.name_user,',',users.avatar_user) SEPARATOR ';') as intervenientes, group_concat(DISTINCT categories.name_category SEPARATOR ',') as categories FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=projects.ref_id_billing_mode LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task LEFT JOIN project_comments ON projects.id_project=project_comments.ref_id_project LEFT JOIN projects_has_categories ON projects.id_project= projects_has_categories.ref_id_project LEFT JOIN categories ON projects_has_categories.ref_id_category = categories.id_category LEFT JOIN users ON users_has_tasks.ref_id_user= users.id_user LEFT JOIN clients ON projects.ref_id_client = clients.id_client WHERE projects.id_project=?",
        [project, project, project, project, project, project, project, project, project, project],
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            totalResults.details = results;
          }
        }
      );
      connection.query(
        'SELECT id_project_comment, text_comment, date_comment, name_user from project_comments INNER JOIN users ON project_comments.ref_id_user=users.id_user WHERE ref_id_project= ?',
        project,
        function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            totalResults.comments = results;
          }
        }
      );
      connection.query(
        'SELECT * FROM costs WHERE ref_id_project = ?', project, function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) { totalResults.costs = results }
        }
      );
      connection.query(
        'SELECT id_task, title_task, ref_id_user_task_status, id_user, avatar_user, name_user, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS "total_hours", deadline_date_task FROM tasks INNER JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task INNER JOIN users ON users_has_tasks.ref_id_user= users.id_user INNER JOIN projects ON tasks.ref_id_project = projects.id_project LEFT JOIN task_hours ON tasks.id_task=task_hours.ref_id_tasks WHERE projects.id_project=? group BY id_task',
        project,
        function(error, results, fields) {
          if (error) throw error;
          totalResults.tasks = results;
          if (totalResults.details[0].id_project !== null) {
            res.send(totalResults);
          } else {
            res.send('nodata');
          }
        }
      );
    }
  });
});

router.post('/comments/:project', checkToken, (req, res) => {
  var project = req.params.project;
  var comment = {
    text_comment: req.body.text_comment,
    ref_id_user: req.body.id_user,
    ref_id_project: project
  };
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('INSERT INTO project_comments SET ?', comment, function(error, results, fields) {
        if (error) throw error;
        res.send(results);
      });
    }
  });
});

router.post('/:id', checkToken, (req, res) => {
  id = req.params.id;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      let newTasks;
      connection.query(
        'CREATE TEMPORARY TABLE tmptable SELECT * FROM projects WHERE id_project = ?; UPDATE tmptable SET id_project = NULL, title_project = IFNULL (CONCAT( title_project , " - Duplicado" ), " - Duplicado"); INSERT INTO projects SELECT * FROM tmptable; DROP TEMPORARY TABLE IF EXISTS tmptable;', id,
        function (error, results, fields) {
          if (error) throw error;
          connection.query(
            'CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM projects_has_categories WHERE ref_id_project = ?; UPDATE tmptable_1 SET ref_id_project = ?; INSERT INTO projects_has_categories SELECT * FROM tmptable_1; DROP TEMPORARY TABLE IF EXISTS tmptable_1;',
            [id, results[2].insertId],
            function (error, results2, fields) {
              if (error) throw error;
              connection.query(
                'CREATE TEMPORARY TABLE tmptable_2 SELECT * FROM tasks WHERE ref_id_project = ?; UPDATE tmptable_2 SET ref_id_project = ?, id_task = NULL, title_task = IFNULL (CONCAT( title_task , " - Duplicada" ), " - Duplicada"); INSERT INTO tasks SELECT * FROM tmptable_2; DROP TEMPORARY TABLE IF EXISTS tmptable_2;',
                [id, results[2].insertId],
                function (error, results3, fields) {
                  if (error) throw error;
                  connection.query(
                    'SELECT id_task FROM tasks WHERE ref_id_project=?', results[2].insertId, function (error, results4, fields) {
                      if (error) throw error;
                      newTasks = JSON.parse(JSON.stringify(results4));
                      connection.query(
                        'SELECT id_task FROM tasks WHERE ref_id_project=?', id, function (error, results5, fields) {
                          if (error) throw error;
                          var res = JSON.parse(JSON.stringify(results5))
                          for (let i = 0; i< res.length; i++) {
                            connection.query(
                              'CREATE TEMPORARY TABLE tmptable_3 SELECT * FROM users_has_tasks WHERE ref_id_task = ?; UPDATE tmptable_3 SET ref_id_task = ?, ref_id_user_task_status = 1; INSERT INTO users_has_tasks SELECT * FROM tmptable_3; DROP TEMPORARY TABLE IF EXISTS tmptable_3;',
                              [res[i].id_task, newTasks[i].id_task], function (error, results6, fields) {
                                if (error) throw error;
                              }
                            );
                          }
                        }
                      );
                  })
                }
              );
            }
          );
          res.send(results);
        }
      );
    }
  });
});

module.exports = router;
