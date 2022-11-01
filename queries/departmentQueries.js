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

// Function to prompt the user about the information of the department to be added, and perform the SQL query based on that
async function addDepartment(db) {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
        },
      ])
      .then(async (data) => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [data.name];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`\nAdded department ${data.name} to the database\n`);
        resolve(data);
      });
  });
}

// Function to prompt the user about the information of the department to be deleted, and perform the SQL query based on that
async function deleteDepartment(db) {
  const departmentList = await helper.getDepartmentNames(db); // Get the list of department names

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "What is the name of the department that you want to delete?",
          choices: departmentList,
        },
      ])
      .then(async (data) => {
        const department_id = await helper.getDepartmentId(db, data.name); // Converting the department name to department_id
        const sql = `DELETE FROM department WHERE id = ?`;
        const params = [department_id[0]];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`\nRemoved department ${data.name} from the database\n`);
        resolve(data);
      });
  });
}

// Function to view the total utilized budget of a department
async function departmentBudget(db) {
  const departmentList = await helper.getDepartmentNames(db); // Get the list of department names

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "What is the name of the department that you want to view the total utilized budget on?",
          choices: departmentList,
        },
      ])
      .then(async (data) => {
        const department_id = await helper.getDepartmentId(db, data.name); // Converting the department name to department_id
        const sql = `SELECT d.name, SUM(salary) AS total_salary
FROM (employee AS e 
INNER JOIN role AS r ON e.role_id = r.id)
INNER JOIN department AS d ON r.department_id = d.id
WHERE department_id = ?;`;
        const params = [department_id[0]];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            console.log("\n");
            console.table(rows);
            resolve(rows);
          })
          .catch(console.log);
      });
  });
}

module.exports = {
  viewAllDepartment,
  addDepartment,
  deleteDepartment,
  departmentBudget,
};
