const express = require('express');
const router = express.Router();
const connection = require('../../dbconnect');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

router.use(cors());

var SECRET_KEY = process.env.SECRET_KEY;
var SLACK_TOKEN = process.env.SLACK_TOKEN;
var checkToken = require('./checkToken');

router.get('/', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('Select * from tasks', function (error, results, fields) {
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
      connection.query(
        'INSERT INTO tasks (title_task, description_task, starting_date_task, deadline_date_task, ref_id_client, ref_id_billing_mode, ref_id_project, ref_id_type_task, ref_id_user_account ) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          req.body.title,
          req.body.description,
          req.body.startdate,
          req.body.deadline,
          req.body.client,
          req.body.billing,
          req.body.project,
          req.body.type,
          req.body.account
        ],
        function (error, results, fields) {
          if (error) throw error;
          connection.query(
            'INSERT INTO users_has_tasks (ref_id_user, ref_id_task, ref_id_user_task_status ) VALUES (?,?,?)',
            [req.body.user, results.insertId, 1],
            function (error, results2, fields) {
              if (error) throw error;
            }
          );
          connection.query(
            'INSERT INTO notifications (type_notification, ref_id_task, ref_id_user) VALUES (?,?,?)',
            [1, results.insertId, req.body.user],
            function (error, results2, fields) {
              if (error) throw error;
              var message = [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": `Olá ${req.body.userName} :wave:`
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Foi-lhe atribuída uma nova Tarefa. Algumas informações:"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": `*Título:*\n${req.body.title}`
                    },
                    {
                      "type": "mrkdwn",
                      "text": `*Deadline:*\n${req.body.deadline}`
                    },
                    {
                      "type": "mrkdwn",
                      "text": `*Cliente:*\n${req.body.clientName}`
                    },
                    {
                      "type": "mrkdwn",
                      "text": `*Account:*\n${req.body.accountName}`
                    }
                  ]
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Se necessitar de mais informações ou se pretender começar já a trabalhar na tarefa clique no botão."
                  },
                  "accessory": {
                    "type": "button",
                    "text": {
                      "type": "plain_text",
                      "text": "Ir para a Tarefa",
                      "emoji": true
                    },
                    "style": "primary",
                    "url": `https://invisual-tarefas.herokuapp.com/tasks/${results.insertId}`
                  }
                },
                {
                  "type": "divider"
                },
                {
                  "type": "context",
                  "elements": [
                    {
                      "type": "mrkdwn",
                      "text": "Please don't shoot the messenger."
                    }
                  ]
                }
              ]
              var encodeMessage = encodeURIComponent(JSON.stringify(message))
              axios.post(`https://slack.com/api/chat.postMessage?token=${SLACK_TOKEN}&channel=${req.body.slackId}&text=Nova%20Tarefa%20atribu%C3%ADda&blocks=${encodeMessage}&pretty=1`)
            }
          );
          if(req.body.extraInputs.length>0){
            for(var i=0, count=req.body.extraInputs.length;i<count; i++){
              let user = req.body.extraInputs[i].user
              let title = req.body.extraInputs[i].title
              let userName = req.body.extraInputs[i].userName
              let userSlack = req.body.extraInputs[i].userSlack
              connection.query('INSERT INTO tasks (title_task, description_task, starting_date_task, deadline_date_task, ref_id_client, ref_id_billing_mode, ref_id_project, ref_id_type_task, ref_id_user_account ) VALUES (?,?,?,?,?,?,?,?,?)',
                [req.body.extraInputs[i].title, req.body.description, req.body.startdate, req.body.deadline, req.body.client, req.body.billing, req.body.project, req.body.type, req.body.account],
                function (error, results2, fields) {
                  if (error) throw error;
                  connection.query('INSERT INTO users_has_tasks (ref_id_user, ref_id_task, ref_id_user_task_status ) VALUES (?,?,?)',
                  [user, results2.insertId, 1],
                  function (error, results3, fields) {
                    if (error) throw error;
                  })
                  connection.query(
                    'INSERT INTO notifications (type_notification, ref_id_task, ref_id_user) VALUES (?,?,?)',
                    [1, results2.insertId, user],
                    function (error, results4, fields) {
                      if (error) throw error;
                      var message2 = [
                        {
                          "type": "section",
                          "text": {
                            "type": "mrkdwn",
                            "text": `Olá ${userName} :wave:`
                          }
                        },
                        {
                          "type": "section",
                          "text": {
                            "type": "mrkdwn",
                            "text": "Foi-lhe atribuída uma nova Tarefa. Algumas informações:"
                          }
                        },
                        {
                          "type": "section",
                          "fields": [
                            {
                              "type": "mrkdwn",
                              "text": `*Título:*\n${title}`
                            },
                            {
                              "type": "mrkdwn",
                              "text": `*Deadline:*\n${req.body.deadline}`
                            },
                            {
                              "type": "mrkdwn",
                              "text": `*Cliente:*\n${req.body.clientName}`
                            },
                            {
                              "type": "mrkdwn",
                              "text": `*Account:*\n${req.body.accountName}`
                            }
                          ]
                        },
                        {
                          "type": "section",
                          "text": {
                            "type": "mrkdwn",
                            "text": "Se necessitar de mais informações ou se pretender começar já a trabalhar na tarefa clique no botão."
                          },
                          "accessory": {
                            "type": "button",
                            "text": {
                              "type": "plain_text",
                              "text": "Ir para a Tarefa",
                              "emoji": true
                            },
                            "style": "primary",
                            "url": `https://invisual-tarefas.herokuapp.com/tasks/${results2.insertId}`
                          }
                        },
                        {
                          "type": "divider"
                        },
                        {
                          "type": "context",
                          "elements": [
                            {
                              "type": "mrkdwn",
                              "text": "Please don't shoot the messenger."
                            }
                          ]
                        }
                      ]
                      var encodeMessage2 = encodeURIComponent(JSON.stringify(message2))
                      axios.post(`https://slack.com/api/chat.postMessage?token=${SLACK_TOKEN}&channel=${userSlack}&text=Nova%20Tarefa%20atribu%C3%ADda&blocks=${encodeMessage2}&pretty=1`)
                  })
                })
            }
          }
          res.send(results);
        }
      );
    }
  });
});

router.post('/:id', checkToken, (req, res) => {
  id = req.params.id;
  user = req.params.user;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'CREATE TEMPORARY TABLE tmptable SELECT * FROM tasks WHERE id_task = ?; UPDATE tmptable SET id_task = NULL, title_task = IFNULL (CONCAT( title_task , " - Duplicada" ), " - Duplicada"); INSERT INTO tasks SELECT * FROM tmptable; DROP TEMPORARY TABLE IF EXISTS tmptable;', id,
        function (error, results, fields) {
          if (error) throw error;
          connection.query(
            'CREATE TEMPORARY TABLE tmptable_1 SELECT * FROM users_has_tasks WHERE ref_id_task = ?; UPDATE tmptable_1 SET ref_id_task = ?; INSERT INTO users_has_tasks SELECT * FROM tmptable_1; DROP TEMPORARY TABLE IF EXISTS tmptable_1;',
            [id, results[2].insertId],
            function (error, results2, fields) {
              if (error) throw error;
            }
          );
          res.send(results);
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
      connection.query(
        'UPDATE tasks SET title_task = ?, description_task = ?,  starting_date_task = ?, deadline_date_task = ?, ref_id_client = ?, ref_id_billing_mode = ?, ref_id_project = ?, ref_id_type_task = ?, ref_id_user_account = ? WHERE id_task = ?',
        [
          req.body.title,
          req.body.description,
          req.body.startdate,
          req.body.deadline,
          req.body.client,
          req.body.billing,
          req.body.project,
          req.body.type,
          req.body.account,
          req.body.id
        ],
        function (error, results, fields) {
          if (error) throw error;
          if (req.body.changeUser) {
            connection.query(
              'DELETE FROM users_has_tasks WHERE ref_id_user = ? AND ref_id_task = ?',
              [req.body.oldUser, req.body.id],
              function (error, results2, fields) {
                if (error) throw error;
                connection.query(
                  'INSERT INTO users_has_tasks (ref_id_user, ref_id_task, ref_id_user_task_status ) VALUES (?,?,?)',
                  [req.body.user, req.body.id, 1],
                  function (error, results3, fields) {
                    if (error) throw error;
                  }
                );
              }
            );
          }
          res.send(results);
        }
      );
    }
  });
});

router.delete('/:id', checkToken, (req, res) => {
  id = req.params.id;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('DELETE FROM tasks WHERE id_task=?', id, function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
      });
    }
  });
});


router.put('/userTaskStatus', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      var status = req.body.status;
      var task = req.body.task;
      var user = req.body.user;
      var project = req.body.project;
      var account = req.body.account;

      connection.query(
        'UPDATE users_has_tasks SET ref_id_user_task_status=? WHERE ref_id_task=?',
        [status, task],
        function (error, results, fields) {
          if (error) throw error;
          if (project !== null && status === 4) {
            connection.query(
              'SELECT id_project, SUM(case WHEN users_has_tasks.ref_id_user_task_status=4 THEN 1 ELSE 0 END)/count(*) *100 AS percentage_tasks FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task WHERE id_project = ?',
              project,
              function (error, results, fields) {
                if (error) throw error;
                if (Number(results[0].percentage_tasks) === 100) {
                  setTimeout(() => {
                    connection.query(
                      'SELECT id_project, SUM(case WHEN users_has_tasks.ref_id_user_task_status=4 THEN 1 ELSE 0 END)/count(*) *100 AS percentage_tasks FROM projects LEFT JOIN tasks ON projects.id_project=tasks.ref_id_project LEFT JOIN users_has_tasks ON tasks.id_task=users_has_tasks.ref_id_task WHERE id_project = ?',
                      project,
                      function (error, results, fields) {
                        if (error) throw error;
                        if (Number(results[0].percentage_tasks) === 100) {
                          connection.query(
                            'INSERT INTO notifications (type_notification, ref_id_user, ref_id_project) VALUES (?,?,?)',
                            [3, account, project],
                            function (error, results, fields) {
                              if (error) throw error;
                            }
                          );
                        }
                      }
                    );
                  }, 10000)
                }
              }
            );
          }
          res.send({ message: status });
        }
      );
    }
  });
});


router.get('/all', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_task, ref_id_user_task_status, title_task, user_task_status.name_user_task_status, starting_date_task, deadline_date_task, projects.ref_id_user_account, tasks.ref_id_client, ref_id_type_task, tasks.ref_id_billing_mode, name_client, name_user, ref_id_project, users_has_tasks.order, users_has_tasks.ref_id_user, GROUP_CONCAT(DISTINCT day) as "total_days" from tasks LEFT JOIN task_hours ON tasks.id_task = task_hours.ref_id_tasks LEFT JOIN clients ON tasks.ref_id_client = clients.id_client LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN users ON users_has_tasks.ref_id_user = users.id_user LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode WHERE tasks.concluded_task=0 AND (concluded_project = 0 OR concluded_project IS NULL) GROUP BY id_task ORDER BY FIELD(ref_id_user_task_status, 4) ASC, FIELD(ref_id_user_task_status, 5) ASC, deadline_date_task ASC',
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
          }
        }
      );
    }
  });
});

router.get('/both', checkToken, (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_task, ref_id_user_task_status, title_task, user_task_status.name_user_task_status, starting_date_task, deadline_date_task, projects.ref_id_user_account, tasks.ref_id_client, ref_id_type_task, tasks.ref_id_billing_mode, name_client, name_user, ref_id_project, users_has_tasks.order, users_has_tasks.ref_id_user, GROUP_CONCAT(DISTINCT day) as "total_days" from tasks LEFT JOIN task_hours ON tasks.id_task = task_hours.ref_id_tasks LEFT JOIN clients ON tasks.ref_id_client = clients.id_client LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN users ON users_has_tasks.ref_id_user = users.id_user LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode GROUP BY id_task ORDER BY FIELD(ref_id_user_task_status, 4) ASC, FIELD(ref_id_user_task_status, 5) ASC, deadline_date_task ASC',
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
          }
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
      connection.query(
        'SELECT id_task, ref_id_user_task_status, title_task, user_task_status.name_user_task_status, starting_date_task, deadline_date_task, projects.ref_id_user_account, tasks.ref_id_client, ref_id_type_task, tasks.ref_id_billing_mode, name_client, ref_id_project, users_has_tasks.order, users_has_tasks.ref_id_user, billed_task, GROUP_CONCAT(DISTINCT day) as "total_days" from tasks LEFT JOIN task_hours ON tasks.id_task = task_hours.ref_id_tasks LEFT JOIN clients ON tasks.ref_id_client = clients.id_client LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode WHERE tasks.concluded_task=2 AND (concluded_project = 2 OR concluded_project IS NULL) GROUP BY id_task  ORDER by users_has_tasks.order DESC, tasks.id_task ASC',
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
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
        'UPDATE tasks SET concluded_task=0, billed_task=NULL, comment_billed_task=NULL, user_billed_task = NULL, conclusion_date_task = NULL WHERE id_task=?', req.body.id,
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
          }
        }
      );
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
        'SELECT id_task, ref_id_user_task_status, title_task, id_user, name_user, name_client, avatar_user, user_task_status.name_user_task_status, starting_date_task, deadline_date_task, projects.ref_id_user_account, tasks.ref_id_client, ref_id_type_task, tasks.ref_id_billing_mode, ref_id_project, users_has_tasks.order, users_has_tasks.ref_id_user, GROUP_CONCAT(DISTINCT day) as "total_days" from tasks LEFT JOIN task_hours ON tasks.id_task = task_hours.ref_id_tasks LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN users ON users_has_tasks.ref_id_user = users.id_user LEFT JOIN clients ON tasks.ref_id_client = clients.id_client LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode where tasks.concluded_task=0 AND (concluded_project = 0 OR concluded_project IS NULL) AND users_has_tasks.ref_id_user= ? GROUP BY id_task ORDER BY FIELD(ref_id_user_task_status, 4) ASC, FIELD(ref_id_user_task_status, 5) ASC, deadline_date_task ASC',
        id,
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
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
        'SELECT id_task, ref_id_user_task_status, title_task, id_user, name_user, name_client, avatar_user, user_task_status.name_user_task_status, starting_date_task, deadline_date_task, projects.ref_id_user_account, tasks.ref_id_client, ref_id_type_task, tasks.ref_id_billing_mode, ref_id_project, users_has_tasks.order, users_has_tasks.ref_id_user, GROUP_CONCAT(DISTINCT day) as "total_days" from tasks LEFT JOIN task_hours ON tasks.id_task = task_hours.ref_id_tasks LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN users ON users_has_tasks.ref_id_user = users.id_user LEFT JOIN clients ON tasks.ref_id_client = clients.id_client LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode where tasks.concluded_task=0 AND (concluded_project = 0 OR concluded_project IS NULL) AND (users_has_tasks.ref_id_user= ? OR tasks.ref_id_user_account = ? OR projects.ref_id_user_account = ?) GROUP BY id_task ORDER by deadline_date_task ASC',
        [id, id, id],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('nodata');
          }
        }
      );
    }
  });
});


router.get('/comments/:task', checkToken, (req, res) => {
  var task = req.params.task;
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_task_comment, text_comments, date_comment, name_user from task_comments INNER JOIN users ON task_comments.ref_id_user=users.id_user WHERE ref_id_task= ?',
        task,
        function (error, results, fields) {
          if (error) throw error;
          res.send(results);
        }
      );
    }
  });
});

router.post('/comments/:task', checkToken, (req, res) => {
  var task = req.params.task;
  var comment = {
    text_comments: req.body.text_comment,
    ref_id_user: req.body.id_user,
    ref_id_task: task
  };
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query('INSERT INTO task_comments SET ?', comment, function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      });
    }
  });
});

router.get('/link/:task', checkToken, (req, res) => {
  var task = req.params.task;
  var totalResults = {};
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_task, (SELECT avatar_user FROM users INNER JOIN tasks ON users.id_user= tasks.ref_id_user_account WHERE id_task= ?) as avatar_account_task, (SELECT avatar_user FROM users INNER JOIN projects ON users.id_user= projects.ref_id_user_account INNER JOIN tasks ON projects.id_project = tasks.ref_id_project WHERE id_task= ?) as avatar_account_project, (SELECT name_user FROM users INNER JOIN tasks ON users.id_user= tasks.ref_id_user_account WHERE id_task= ?) as name_account, avatar_user, name_user, title_task, creation_date_task, deadline_date_task, title_project, ref_id_type_task, ref_id_project, name_client, name_task_types, name_billing_mode, tasks.ref_id_billing_mode, description_task, date_approved_task, user_approved_task, conclusion_date_task, user_concluded_task, (SELECT avatar_user from users INNER JOIN tasks ON users.id_user = tasks.user_approved_task WHERE tasks.id_task=?) AS avatar_approved_user, (SELECT name_user from users INNER JOIN tasks ON users.id_user = tasks.user_approved_task WHERE tasks.id_task=?) AS name_approved_user, (SELECT avatar_user from users INNER JOIN tasks ON users.id_user = tasks.user_concluded_task WHERE tasks.id_task=?) AS avatar_concluded_user, (SELECT name_user from users INNER JOIN tasks ON users.id_user = tasks.user_concluded_task WHERE tasks.id_task=?) AS name_concluded_user, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS "total_hours" from tasks LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode LEFT JOIN clients ON clients.id_client=tasks.ref_id_client LEFT JOIN users ON users.id_user=users_has_tasks.ref_id_user LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task where tasks.id_task=?',
        [task, task, task, task, task, task, task, task],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            totalResults.details = results;
          }
        }
      );
      connection.query(
        'SELECT id_task_comment, text_comments, date_comment, name_user from task_comments INNER JOIN users ON task_comments.ref_id_user=users.id_user WHERE ref_id_task= ?',
        task,
        function (error, results, fields) {
          if (error) throw error;
          totalResults.comments = results;
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

router.get('/basic/:task', checkToken, (req, res) => {
  var task = req.params.task;
  var totalResults = {};
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT * FROM tasks INNER JOIN users_has_tasks ON tasks.id_task = users_has_tasks.ref_id_task WHERE id_task=?',
        task,
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            res.send(results);
          } else {
            res.send('notask');
          }
        }
      );
    }
  });
});

router.get('/content/:task', checkToken, (req, res) => {
  var task = req.params.task;
  var totalResults = {};
  jwt.verify(req.token, SECRET_KEY, (err, results) => {
    if (err) {
      //If error send Forbidden (403)
      res.sendStatus(403);
    } else {
      connection.query(
        'SELECT id_task, (SELECT avatar_user FROM users INNER JOIN tasks ON users.id_user= tasks.ref_id_user_account WHERE id_task= ?) as avatar_account_task, (SELECT avatar_user FROM users INNER JOIN projects ON users.id_user= projects.ref_id_user_account INNER JOIN tasks ON projects.id_project = tasks.ref_id_project WHERE id_task= ?) as avatar_account_project, (SELECT name_user FROM users INNER JOIN tasks ON users.id_user= tasks.ref_id_user_account WHERE id_task= ?) as name_account, avatar_user, name_user, title_task, creation_date_task, deadline_date_task, title_project, ref_id_type_task, ref_id_project, name_client, name_task_types, name_billing_mode, tasks.ref_id_billing_mode, description_task, date_approved_task, user_approved_task, conclusion_date_task, user_concluded_task, (SELECT avatar_user from users INNER JOIN tasks ON users.id_user = tasks.user_approved_task WHERE tasks.id_task=?) AS avatar_approved_user, (SELECT name_user from users INNER JOIN tasks ON users.id_user = tasks.user_approved_task WHERE tasks.id_task=?) AS name_approved_user, (SELECT avatar_user from users INNER JOIN tasks ON users.id_user = tasks.user_concluded_task WHERE tasks.id_task=?) AS avatar_concluded_user, (SELECT name_user from users INNER JOIN tasks ON users.id_user = tasks.user_concluded_task WHERE tasks.id_task=?) AS name_concluded_user, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS "total_hours" from tasks LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode LEFT JOIN clients ON clients.id_client=tasks.ref_id_client LEFT JOIN users ON users.id_user=users_has_tasks.ref_id_user LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task where tasks.id_task=?',
        [task, task, task, task, task, task, task, task],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) { totalResults.details = results }
        }
      );
      connection.query(
        'SELECT * FROM costs WHERE ref_id_task = ?', task, function (error, results, fields) {
          if (error) throwerror;
          if (results.length > 0) { totalResults.costs = results }
        }
      );
      connection.query(
        'SELECT id_task_comment, text_comments, date_comment, name_user from task_comments INNER JOIN users ON task_comments.ref_id_user=users.id_user WHERE ref_id_task= ?',
        task,
        function (error, results, fields) {
          if (error) throwerror;
          totalResults.comments = results;
          if (totalResults.details[0].id_task !== null) { res.send(totalResults) }
          else { res.send('nodata') }
        }
      );
    }
  });
});

//SELECT text_comments, date_comment, name_user from task_comments INNER JOIN users ON task_comments.ref_id_user=users.id_user WHERE ref_id_task=3

// SELECT avatar_user, title_task, creation_date_task, title_project, name_client, name_task_types, name_billing_mode, description_task, text_comments, date_comment, SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(task_hours.ending_hour, task_hours.beginning_hour)))) AS '' from tasks LEFT JOIN users_has_tasks on users_has_tasks.ref_id_task=tasks.id_task LEFT JOIN task_types on task_types.id_task_type=tasks.ref_id_type_task LEFT JOIN aproval_task_status ON aproval_task_status.id_aproval_task_status=tasks.ref_id_aproval_task_status LEFT JOIN user_task_status ON user_task_status.id_user_task_status=users_has_tasks.ref_id_user_task_status LEFT JOIN projects ON tasks.ref_id_project=projects.id_project LEFT JOIN billing_modes ON billing_modes.id_billing_mode=tasks.ref_id_billing_mode LEFT JOIN clients ON clients.id_client=tasks.ref_id_client LEFT JOIN users ON users.id_user=projects.ref_id_user LEFT JOIN task_comments on task_comments.ref_id_task=tasks.id_task LEFT JOIN task_hours ON task_hours.ref_id_tasks=tasks.id_task where tasks.concluded_task=0 AND users_has_tasks.ref_id_user=2 AND tasks.id_task=3
module.exports = router;
