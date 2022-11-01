const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const helper = require("../helper/simpleQueries");

// Function to perform the query that prints out all roles
function viewAllRole(db) {
  const sql = `SELECT id, title, (SELECT name FROM department AS d WHERE d.id = r.department_id) AS department, salary FROM role AS r;`;

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
  viewAllRole,
};
