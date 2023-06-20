const { Pool } = require('pg');
const express = require('express');
const app = express();
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});


app.get('/active', async (req, res) => {
   
    pool.query('SELECT * FROM exam_question_tbl WHERE exam_status = \'active\'', (error, results) => {
        if (error) {
          return res.status(500).json({
          message:('Error executing the active fields :' + error)
          });
        }
        const activeData = results; 
        if(activeData.rows.length == 0)
        {
          return res.status(404).json({
            message:('Data not present ')
            });
        }
        res.json(activeData.rows);
    });
});


app.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    pool.query(`SELECT * FROM exam_question_tbl WHERE exam_id = '${id}'`, (error, results) => {
      if (error) {
        return res.status(500).json({
        error:('Error excuting the id inside the database:' + error)
        });
      }
      
      const activeData = results;
      if(activeData.rows.length == 0)
        {
          return res.status(404).json({
            message:('Data not present ')
            });
        }
      res.json(activeData.rows);
    });
  });
  

app.listen(port,()=>
{
    console.log(`Server is running on http://localhost:${port}`);
})