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
        return employeeQueries.viewAllEmployee(db);
      } else if (respond.options === "Add Employee") {
        return employeeQueries.addEmployee(db);
      } else if (respond.options === "Update Employee Role") {
        return employeeQueries.updateEmployeeRole(db);
      } else if (respond.options === "View All Roles") {
        return roleQueries.viewAllRole(db);
      } else if (respond.options === "Add Role") {
        return roleQueries.addRole(db);
      } else if (respond.options === "View All Departments") {
        return departmentQueries.viewAllDepartment(db);
      } else if (respond.options === "Add Department") {
        return departmentQueries.addDepartment(db);
      } else {
        isFinished = true;
        console.log("See you next time!");
        process.exit(0);
      } 
    });
  }
}

init();
