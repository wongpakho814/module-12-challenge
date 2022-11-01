const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

// List of SQL queries used later
const viewAllEmployeeSQL = `SELECT e.id, first_name, last_name, r.title, d.name AS department, r.salary, 
    (SELECT CONCAT_WS(" ", first_name, last_name) FROM employee AS e2 WHERE e2.id = e.manager_id) AS manager
FROM (role AS r INNER JOIN department AS d ON r.department_id = d.id)
INNER JOIN employee AS e ON e.role_id = r.id;`;
const addEmployeeSQL = ``;

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

// Function that returns all role titles from the role table as an array
function getRoleTitles(db) {
  db.promise()
    .query(`SELECT title FROM role`)
    .then(([rows, fields]) => {
      return rows.map((role) => role.title);
    })
    .catch(console.log);
}

// Function to prompt the user about the information of the employee to be added, and perform the SQL query based on that
function addEmployee(db) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: getRoleTitles(db),
        },
        {
          type: "input",
          name: "manager",
          message: "Who is the employee's manager?",
        },
      ])
      .then((data) => {
        console.log(`Added ${data.firstName} ${data.lastName} to the database`);
        resolve(data);
      });
  });
}

module.exports = {
  viewAllEmployee,
  getRoleTitles,
  addEmployee,
};
