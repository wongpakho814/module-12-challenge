const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const helper = require("../helper/simpleQueries");

// Function to perform the query that prints out all roles
function viewAllRole(db) {
  const sql = `SELECT id, title, (SELECT name FROM department AS d WHERE d.id = r.department_id) AS department, salary 
  FROM role AS r 
  ORDER BY r.id;`;

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

// Function to prompt the user about the information of the role to be added, and perform the SQL query based on that
async function addRole(db) {
  const departmentList = await helper.getDepartmentNames(db);

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: departmentList,
        },
      ])
      .then(async (data) => {
        const department_id = await helper.getDepartmentId(db, data.department); // Converting the department name to department_id
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        const params = [
          data.title,
          data.salary,
          department_id[0],
        ];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`\nAdded role ${data.title} to the database\n`);
        resolve(data);
      });
  });
}

// Function to prompt the user about the information of the role to be deleted, and perform the SQL query based on that
async function deleteRole(db) {
  const roleList = await helper.getRoleTitles(db); // Get the list of role titles

  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "title",
          message: "What is the title of the role that you want to delete?",
          choices: roleList,
        },
      ])
      .then(async (data) => {
        const role_id = await helper.getRoleId(db, data.title); // Converting the role title to role_id
        const sql = `DELETE FROM role WHERE id = ?`;
        const params = [role_id[0]];

        db.promise()
          .query(sql, params)
          .then(([rows, fields]) => {
            resolve(rows);
          })
          .catch(console.log);

        console.log(`\nRemoved role ${data.title} from the database\n`);
        resolve(data);
      });
  });
}

module.exports = {
  viewAllRole,
  addRole,
  deleteRole,
};
