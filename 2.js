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


app.get('/active', async (req, res) => {
  try {
    const query = req.query;

    let sqlQuery = 'SELECT * FROM exam_question_tbl WHERE 1=1';
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



app.get('/:id', async (req, res) => {
        try {
          const id = req.params.id;
          const query = req.query;
          let sqlQuery = `SELECT * FROM exam_question_tbl WHERE exam_id = ?`;
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