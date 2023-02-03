USE employee_tracker;

INSERT INTO department (name) VALUES ('Corparate'), ('FoH'), ('BoH');

INSERT INTO role (title, salary, department_id) VALUES
('Line Cook', 25000, 3),
('Server', 10000, 2),
('Manager', 50000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Jaime', 'Johnson', 3, NULL), 
('Kenny', 'Cordero', 2, 1),
('Henry', 'Federer', 1, 1); 









