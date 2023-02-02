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
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Roles') {
        let viewRoles = await viewAllRoles();
        let menu = await mainMenu();

    } else if (choice.choice === 'Add Role') {
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Departments') {
        let vad = await viewAllDepartments();
        let menu = await mainMenu();
        
    } else if (choice.choice === 'Add Department') {
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'Exit') {
        return
    }
}

const viewAllEmployees = async () => {
    let [rows, columns] = await db.promise().query('SELECT * FROM employee')
        if (rows.length === 0) {
            return console.log("Sorry, there isn't anything in your table!");
        } else {
            console.table([[rows, columns]]);
        }
    }

const addEmployee = async () => {
    const answers = await inquirer.prompt([
        { name: 'first_name', message: 'First Name: ' },
        { name: 'last_name', message: 'Last Name: ' },
        { name: 'role_id', message: 'Role ID: ' },
        { name: 'manager_id', message: 'Manager ID: ' },
    ]);

    const results = await db.execute(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
      );
    console.log(`The results are ${JSON.stringify(results)}`)
    return;
};

const addRole = async () => {
    const answers = await inquirer.prompt([
        { name: 'title', message: 'Title: ' },
        { name: 'salary', message: 'Salary: ' },
        { name: 'role_id', message: 'Role ID: ' },
        { name: 'manager_id', message: 'Manager ID: ' },
    ]);

    const results = await db.execute(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
      );
    db.end();
}

const updateEmployeeRole = async () => {
    //Update Employee Role
}

const viewAllRoles = async () => {
    let [rows, columns] = await db.promise().query('SELECT * FROM role')
        if (rows.length === 0) {
            return console.log("Sorry, there isn't anything in your table!");
        } else {
            console.table([[rows, columns]]);
        }
    }

const viewAllDepartments = async () => {
    let [rows, columns] = await db.promise().query('SELECT * FROM department')
        if (rows.length === 0) {
            return console.log("Sorry, there isn't anything in your table!");
        } else {
            console.table([[rows, columns]]);
        }
    }

const addDepartment = async () => {
    //Add a department
}

const init = async () => {
    let menu = await mainMenu();
}

init();