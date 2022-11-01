const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const employeeQueries = require("./queries/employeeQueries.js");
const roleQueries = require("./queries/roleQueries.js");
const departmentQueries = require("./queries/departmentQueries.js");

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
      "Update Employee Manager",
      "View Employees By Manager",
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
      switch (respond.options) {
        case "View All Employees":
          return employeeQueries.viewAllEmployee(db);
        case "Add Employee":
          return employeeQueries.addEmployee(db);
        case "Update Employee Role":
          return employeeQueries.updateEmployeeRole(db);
        case "Update Employee Manager":
          return employeeQueries.updateEmployeeManager(db);
        case "View Employees By Manager":
          return employeeQueries.viewEmployeeByManager(db);
        case "View All Roles":
          return roleQueries.viewAllRole(db);
        case "Add Role":
          return roleQueries.addRole(db);
        case "View All Departments":
          return departmentQueries.viewAllDepartment(db);
        case "Add Department":
          return departmentQueries.addDepartment(db);
        default:
          isFinished = true;
          console.log("See you next time!");
          process.exit(0);
      }
    });
  }
}

init();
