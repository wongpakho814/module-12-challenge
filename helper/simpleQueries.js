const mysql = require("mysql2");

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
    db.query(`SELECT id FROM role WHERE title = "${data}"`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.map((role_id) => role_id.id));
      }
    });
  });
}

// Function to get the employee id specified by the name of the employee
function getEmployeeId(db, data) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM employee WHERE CONCAT_WS(" ", first_name, last_name) = "${data}"`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.map((employee_id) => employee_id.id));
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

// Function that returns all department names
function getDepartmentNames(db) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT name FROM department`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.map((department) => department.name));
        }
      }
    );
  });
}

// Function that return the id of the department given the department's name
function getDepartmentId(db, data) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id FROM department WHERE name = "${data}"`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.map((department_id) => department_id.id));
        }
      }
    );
  });
}

module.exports = {
  getRoleTitles,
  getRoleId,
  getEmployeeId,
  getEmployeeNames,
  getDepartmentNames,
  getDepartmentId,
};
