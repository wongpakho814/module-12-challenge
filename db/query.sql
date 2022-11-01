SELECT CONCAT_WS(" ", first_name, last_name) AS department 
FROM (employee AS e
INNER JOIN role AS r ON r.id = e.role_id)
INNER JOIN department AS d ON d.id = r.department_id
WHERE department_id = 3;