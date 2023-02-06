const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//Connecting to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'sql123',
      database: 'employee_tracker'
    },
    console.log(`Connected to the classlist_db database.`)
);

//The main menu function that the user is returned to after each selection
const mainMenu = async () => {
    const choice = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit'],
            pageSize: 8
        }
    ]);
    if (choice.choice === 'View All Employees') {
        let viewEmployees = await viewAllEmployees();
        let menu = await mainMenu();

    } else if (choice.choice === 'Add Employee') {
        let addEmp = await addEmployee();
        let menu = await mainMenu();

    } else if (choice.choice === 'Update Employee Role') {
        let uer = await updateEmployeeRole();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Roles') {
        let viewRoles = await viewAllRoles();
        let menu = await mainMenu();

    } else if (choice.choice === 'Add Role') {
        let ad = await addRole();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Departments') {
        let vad = await viewAllDepartments();
        let menu = await mainMenu();
        
    } else if (choice.choice === 'Add Department') {
        let ad = await addDepartment();
        let menu = await mainMenu();

    } else {
        db.end();
        return
    }
}

//Fetches the roles from the respective table
const getActiveRoles = async () => {
    let [col] = await db.promise().query('SELECT * FROM role');
    return col;
}

//Fetches the departments from the respective table
const getActiveDepartments = async () => {
    let [col] = await db.promise().query('SELECT * FROM department');
    return col;
}

//Fetches the managers from the respective table
const getActiveManagers = async () => {
    let [col] = await db.promise().query('SELECT first_name FROM employee WHERE role_id = 3');
    return col;
}

//==============Main functions=================
const viewAllEmployees = async () => {
    //A 3 way join that uses the foreign keys to display some information from each table
    let [employees] = await db.promise().query('SELECT employee.employee_id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee LEFT JOIN role on (employee.role_id = role.role_id) LEFT JOIN department on (role.department_id = department.id) LEFT JOIN employee AS manager on (employee.manager_id = manager.employee_id)')

    return console.table(employees);
}

const addEmployee = async () => {
    //Getting the current roles
    const roles = await getActiveRoles();

    //Getting the current managers
    const managers = await getActiveManagers(); 

    //Creating a poor man's hashmap of the current available roles so the user can view the name of the role, but the application can use the id of the role to select the correct role.
    let map = roles.map (roles => {
        return ({
            name: roles.title,
            value: roles.role_id
        })
    })

    //Creating a poor man's hashmap of the current available managers so the user can view the name of the manager, but the application can use the id of the manager to select the correct manager.
    let managerMap = managers.map (managers => {
        return ({
            name: managers.first_name,
            value: managers.role_id
        })
    })

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'First Name: ',
        }, 

        {
            type: 'input',
            name: 'last_name',
            message: 'Last Name: ',
        }, 

        {
            type: 'list',
            name: 'role_id',
            message: 'Role ID:',
            choices: map
        },

        {
            type: 'list', 
            name: 'manager',
            message: 'Who is the manager?',
            choices: [...managerMap, 'None']
        }
    ]);
    if (answers.manager === 'None') {
        answers.manager = null;
    }
    
    const [results] = await db.promise().query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, answers.role_id, answers.manager], ((err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
            }));
    
    //Simply displaying the updated 3 way join
    let [employees] = await db.promise().query('SELECT employee.employee_id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee LEFT JOIN role on (employee.role_id = role.role_id) LEFT JOIN department on (role.department_id = department.id) LEFT JOIN employee AS manager on (employee.manager_id = manager.employee_id)')

    return console.table(employees);
};

const updateEmployeeRole = async () => {
    const roles = await getActiveRoles();
    let map = roles.map (roles => {
        return ({
            name: roles.title,
            value: roles.role_id
        })
    })

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_first_name',
            message: 'Employee First Name: ',
        },

        {
            type: 'list',
            name: 'role_change',
            message: 'Change to what role: ',
            choices: map
        },
    ]);

    const results = await db.promise().query('UPDATE employee SET role_id = ? WHERE first_name = ?', [answers.role_change, answers.employee_first_name]);

    let [employees] = await db.promise().query('SELECT employee.employee_id AS id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager FROM employee LEFT JOIN role on (employee.role_id = role.role_id) LEFT JOIN department on (role.department_id = department.id) LEFT JOIN employee AS manager on (employee.manager_id = manager.employee_id)')

    return console.table(employees);
}

const viewAllRoles = async () => {
    let [roles] = await db.promise().query('SELECT role.role_id, role.title, role.salary, department.name as department FROM role INNER JOIN department ON role.department_id = department.id;')

    return console.table(roles);
}

const addRole = async () => {
    let departments = await getActiveDepartments();

    let map = departments.map (dept => {
        return ({
            name: dept.name,
            value: dept.id
        })
    })

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Role title: ',
        }, 

        {
            type: 'number',
            name: 'salary',
            message: 'Salary: ',
        }, 

        {
            type: 'list',
            name: 'department_id',
            message: 'Department ID:',
            choices: map
        }
    ]);

    const [results] = await db.promise().query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.role_title, answers.salary, answers.department_id], ((err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(result);
          }));
    
    let [roles] = await db.promise().query('SELECT role.role_id, role.title, role.salary, department.name as department_name FROM role INNER JOIN department ON role.department_id = department.id;')

    return console.table(roles);
}

const init = async () => {
    let menu = await mainMenu();
}

const viewAllDepartments = async () => {
    const [departments] = await db.promise().query('SELECT * FROM department');

    return console.table(departments);
}

const addDepartment = async () => {
    const answers = await inquirer.prompt([
        { name: 'department_name', message: 'Department Name: ' }
    ]);

    const [results] = await db.promise().query(
        'INSERT INTO department (name) VALUES (?)', answers.department_name, ((err, result) => {
            if (err) {
              console.log(err);
            }
            console.log(result);
          }));

    //Adds the new department to the table
    const [[createdDepartment]] = await db.promise().query('SELECT * FROM department WHERE name = ?', answers.department_name);

    //Gets all the departments (plus the newest) and displays that to the user
    const [departments] = await db.promise().query('SELECT * FROM department');

    return console.table(departments);
}

init();