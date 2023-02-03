DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    role_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    employee_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
        FOREIGN KEY (role_id)
        REFERENCES role(role_id),
    manager_id INT,
        FOREIGN KEY (manager_id)
        REFERENCES employee(employee_id)
);

USE employee_tracker;

INSERT INTO department (name) VALUES ('Corparate'), ('FoH'), ('BoH');

INSERT INTO role (title, salary, department_id) VALUES
('Line Cook', 25000, 3),
('Server', 10000, 2),
('Manager', 50000, 1);

--I am getting a 1452 error when I enter the employees. What is the correct solution?
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jaime', 'Johnson', 3, NULL), --Manager (role location 3), manager is null since he does not have a manager.

('Kenny', 'Cordero', 2, 1),--Server(Role location 2), manager is Jaime Johnson (employee location is 2).

('Henry', 'Federer', 1, 1); --Line cook (role location 1), manager is Jamie Johnson (employee location is 2).

('Bob', 'Fisher', 3)

--I want to get all the employees first_name who's manager_id is NULL. How would I write this query?








