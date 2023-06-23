const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});



pool.getConnection((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
}); 

app.get('/', (req, res) => {
  res.send('Welcome to my website!');
});

function executeQuery(sqlQuery, sqlParams) {
  return new Promise((resolve, reject) => {
    pool.query(sqlQuery, sqlParams, (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
}


//this will help to set a particular id and set its id to active//
app.post('/:id_soal/marked_for_Submit', async (req, res) => {
  try {
    const id = req.params.id_soal;
    let sqlQuery = 'UPDATE tb_soal SET question_status = ? WHERE id_soal = ?';
    let sqlParams = ['Submitted', id];

    executeQuery(sqlQuery, sqlParams)
      .then(() => {
        res.json({
          message: 'Submitted sucessfully',
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});


app.post('/:id_soal/set_for_review', async (req, res) => {
  try {
    const id = req.params.id_soal;
    let sqlQuery = 'UPDATE tb_soal SET question_status = ? WHERE id_soal = ?';
    let sqlParams = ['On review', id];

    executeQuery(sqlQuery, sqlParams)
      .then(() => {
        res.json({
          message: 'Added for reviewed',
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: 'Internal server error',
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});



// wil shoow all active fileds //
app.get('/active', async (req, res) => {
  try {
    const query = req.query;
    let sqlQuery = 'SELECT * FROM tb_soal WHERE status = \'active\'';
    let sqlParams = [];

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        sqlQuery += ` AND ${key} = ?`;
        sqlParams.push(query[key]);
      }
    }

    executeQuery(sqlQuery, sqlParams)
      .then((activeData) => {
        if (activeData.length === 0) {
          return res.status(404).json({
            message: 'Data List is empty',
          });
        }
        res.json(activeData);
      })
      .catch(() => {
        return res.status(500).json({
          message: 'Internal server error',
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});



app.get('/reviewquestions', async (req, res) => {
  try {
    const query = req.query;
    let sqlQuery = 'SELECT * FROM tb_soal WHERE question_status = \'On review\'';
    let sqlParams = [];

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        sqlQuery += ` AND ${key} = ?`;
        sqlParams.push(query[key]);
      }
    }

    executeQuery(sqlQuery, sqlParams)
      .then((activeData) => {
        if (activeData.length === 0) {
          return res.status(404).json({
            message: 'No questions for review',
          });
        }
        res.json(activeData);
      })
      .catch(() => {
        return res.status(500).json({
          message: 'Internal server error',
        });
      });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

    
    //this will  help to search by id//
        app.get('/:id', async (req, res) => {
          try {
            const id = req.params.id;
            const query = req.query;
            let sqlQuery = `SELECT * FROM tb_soal WHERE id_soal = ?`;
            let sqlParams = [id];

            for (const key in query) {
              if (query.hasOwnProperty(key)) {
                sqlQuery += ` AND ${key} = ?`;
                sqlParams.push(query[key]);
              }
            }

            executeQuery(sqlQuery, sqlParams)
              .then((activeData) => {
                if (activeData.length === 0) {
                  return res.status(404).json({
                    message: 'Data not present',
                  });
                }
                res.json(activeData);
              })
              .catch(() => {
                return res.status(500).json({
                  message: 'Internal server error',
                });
              });
          } catch (error) {
            return res.status(500).json({
              message: 'Internal server error',
            });
          }
        });

app.listen(port,()=>
{
    console.log(`Server is running on http://localhost:${port}`);
})