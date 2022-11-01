const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const helper = require("../helper/simpleQueries");

// Function to perform the query that prints out all employees
function viewAllEmployee(db) {
  const sql = `SELECT e.id, first_name, last_name, r.title, d.name AS department, r.salary, 
    (SELECT CONCAT_WS(" ", first_name, last_name) FROM employee AS e2 WHERE e2.id = e.manager_id) AS manager
FROM (role AS r INNER JOIN department AS d ON r.department_id = d.id)
INNER JOIN employee AS e ON e.role_id = r.id 
ORDER BY e.id;`;

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

// Function to prompt the user about the information of the employee to be added, and perform the SQL query based on that
async function addEmployee(db) {
  const roles = await helper.getRoleTitles(db); // Getting an array of role titles for the choices parameter
  const names = await helper.getEmployeeNames(db); // Getting an array of employee names for the choices parameter
  names.unshift("None");

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
          choices: roles,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: names,
        },
      ])
      .then(async (data) => {
        const role_id = await helper.getRoleId(db, data.role); // Converting the role title to role_id
        const employee_id = await helper.getEmployeeId(db, data.manager); // Converting the employee name to the id
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [
          data.firstName,
          data.lastName,
          role_id[0],
          employee_id[0]
        ];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`Added ${data.firstName} ${data.lastName} to the database`);
        resolve(data);
      });
  });
}

// Function to perform the query that update an employee's role
async function updateEmployeeRole(db) {
  const employeeList = await helper.getEmployeeNames(db); // Getting an array of employee names for the choices parameter
  const roles = await helper.getRoleTitles(db); // Getting an array of role titles for the choices parameter

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee's role do you want to update?",
          choices: employeeList,
        },
        {
          type: "list",
          name: "newRole",
          message: "Which role do you want to assign the selected employee?",
          choices: roles,
        },
      ])
      .then(async (data) => {
        const role_id = await helper.getRoleId(db, data.newRole); // Converting the role title to role_id
        const employee_id = await helper.getEmployeeId(db, data.employee); // Converting the employee name to the id
        const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
        const params = [
          role_id[0],
          employee_id[0],
        ];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`Updated ${data.employee}'s role`);
        resolve(data);
      });
  });
}

// Function to perform the query that update an employee's manager
async function updateEmployeeManager(db) {
  const employeeList = await helper.getEmployeeNames(db); // Getting an array of employee names for the choices parameter
  const managerList = await helper.getEmployeeNames(db); // Getting an array of employee names for the newManager choices parameter
  managerList.unshift("None");

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee's role do you want to update?",
          choices: employeeList,
        },
        {
          type: "list",
          name: "newManager",
          message: "Who is the new manager of the selected employee?",
          choices: managerList,
        },
      ])
      .then(async (data) => {
        // Check if the updated manager is the employee himself/herself, if so throw an error
        if (data.employee === data.newManager) {
          reject("An employee cannot be the manager of himself/herself!");
        }
        const employee_id = await helper.getEmployeeId(db, data.employee); // Converting the employee name to the employee id
        const manager_id = await helper.getEmployeeId(db, data.newManager); // Converting the manager name to the employee id
        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        const params = [manager_id[0], employee_id[0]];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`Updated ${data.employee}'s manager`);
        resolve(data);
      });
  });
}

module.exports = {
  viewAllEmployee,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
};
