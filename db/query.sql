SELECT d.name, SUM(salary) AS total_salary
FROM (employee AS e 
INNER JOIN role AS r ON e.role_id = r.id)
INNER JOIN department AS d ON r.department_id = d.id
WHERE department_id = 1;