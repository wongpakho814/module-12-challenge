const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

// List of SQL queries used later
const viewAllEmployeeSQL = `SELECT e.id, first_name, last_name, r.title, d.name AS department, r.salary, 
    (SELECT CONCAT_WS(" ", first_name, last_name) FROM employee AS e2 WHERE e2.id = e.manager_id) AS manager
FROM (role AS r INNER JOIN department AS d ON r.department_id = d.id)
INNER JOIN employee AS e ON e.role_id = r.id;`;

// Function that acts as the main menu for user to choose an option until the "Quit" option is picked
const showMenu = () => {
  return inquirer.prompt({
    type: "list",
    name: "options",
    message: "What would you like to do?\n",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  });
};

// Function to initialize the application
async function init() {
  let isFinished = false;
  while (isFinished === false) {
    await showMenu().then((respond) => {
      if (respond.options === "View All Employees") {
        return new Promise((resolve, reject) => {
          db.promise()
            .query(viewAllEmployeeSQL)
            .then(([rows, fields]) => {
              console.log("\n");
              console.table(rows);
              resolve(rows);
            })
            .catch(console.log)
            .then(() => db.end());
        });
      }
    });
  }
}

init();
