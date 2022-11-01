const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

// Function that returns all role titles from the role table as an array
function getRoleTitles(db) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT title FROM role`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.map((role) => role.title));
      }
    });
  });
}

// Function to get the role_id specified by the role title
function getRoleId(db, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM role WHERE title = "${data.role}"`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.map((role_id) => role_id.id));
          }
        }
      );
    });
}

// Function to get the manager_id specified by the name of the employee
function getManagerId(db, data) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = "${data.manager}"`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.map((manager_id) => manager_id.id));
          }
        }
      );
    });
}

// Function that returns all employees names (first+last name) from the employee table as an array
function getEmployeeNames(db) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT CONCAT_WS(" ", first_name, last_name) AS name FROM employee`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.map((employee) => employee.name));
        }
      }
    );
  });
}

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
  const roles = await getRoleTitles(db); // Getting an array of titles for the choice parameter
  const names = await getEmployeeNames(db); // Getting an array of employee names for the choice parameter
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
        const role_id = await getRoleId(db, data); // Converting the role title to role_id
        const manager_id = await getManagerId(db, data); // Converting the employee name to manager_id
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        const params = [
          data.firstName,
          data.lastName,
          role_id[0],
          manager_id[0]
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

module.exports = {
  viewAllEmployee,
  addEmployee,
};
