const mysql = require("mysql2");
const cTable = require("console.table");

// List of SQL queries used later
const viewAllEmployeeSQL = `SELECT e.id, first_name, last_name, r.title, d.name AS department, r.salary, 
    (SELECT CONCAT_WS(" ", first_name, last_name) FROM employee AS e2 WHERE e2.id = e.manager_id) AS manager
FROM (role AS r INNER JOIN department AS d ON r.department_id = d.id)
INNER JOIN employee AS e ON e.role_id = r.id;`;

// Function to perform the query that prints out all employees
function viewAllEmployee(db) {
  return new Promise((resolve, reject) => {
    db.promise()
      .query(viewAllEmployeeSQL)
      .then(([rows, fields]) => {
        console.log("\n");
        console.table(rows);
        resolve(rows);
      })
      .catch(console.log);
  });
}

module.exports = {
  viewAllEmployee
};