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
