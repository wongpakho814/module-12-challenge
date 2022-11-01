const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const helper = require("../helper/simpleQueries");

// Function to perform the query that prints out all departments
function viewAllDepartment(db) {
  const sql = `SELECT * FROM department AS d ORDER BY d.id;`;

  return new Promise((resolve, reject) => {
    db.promise()
      .query(sql)
      .then(([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        resolve(rows);
      })
      .catch(console.log);
  });
}

module.exports = {
  viewAllDepartment,
};
