const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const queries = require("./queries.js");

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
        return queries.viewAllEmployee(db);
      } else if (respond.options === "Add Employee") {
        return queries.addEmployee(db);
      } else if (respond.options === "Update Employee Role") {
        return queries.updateEmployeeRole(db);
      }
    });
  }
}

init();
