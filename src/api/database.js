const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      return;
    }
    console.log('Connected to MySQL database');
    
    // Create database 'snappy' if it doesn't exist
    connection.query('CREATE DATABASE IF NOT EXISTS snappy', (err, results) => {
      if (err) {
        console.error('Error creating database: ', err);
        return;
      }
      console.log('Database "snappy" created successfully');
  
      // Use the 'snappy' database
      connection.query('USE snappy', (err) => {
        if (err) {
          console.error('Error selecting database: ', err);
          return;
        }
  
        // Drop customer_profile table if it exists
        const dropTableQuery = 'DROP TABLE IF EXISTS customer_profile';
        connection.query(dropTableQuery, (err, results) => {
          if (err) {
            console.error('Error dropping customer_profile table: ', err);
            return;
          }
          console.log('Customer profile table dropped (if existed)');
  
          // Create customer_profile table with custId, custName, custAddress, and custPhoneNumber columns
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS customer_profile (
              custId  VARCHAR(255) PRIMARY KEY,
              custName VARCHAR(255) NOT NULL,
              custAddress VARCHAR(255) NOT NULL,
              custPhoneNumber VARCHAR(20) NOT NULL
            )
          `;
          connection.query(createTableQuery, (err, results) => {
            if (err) {
              console.error('Error creating customer_profile table: ', err);
              return;
            }
            console.log('Customer profile table created successfully');
            // Close MySQL connection
            connection.end();
          });
        });
      });
    });
  });