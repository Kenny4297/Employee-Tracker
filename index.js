const inquirer = require('inquirer');

const mainMenu = async () => {
    const choice = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
            pageSize: 7
        }
    ]);

    if (choice.choice === 'View All Employees') {
        // let manager = await managerFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'Add Employee') {
        // let engineer = await engineerFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'Update Employee Role') {
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Roles') {
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'Add Role') {
        // let intern = await internFunction();
        let menu = await mainMenu();

    } else if (choice.choice === 'View All Departments') {
        // let intern = await internFunction();
        let menu = await mainMenu();
        
    } else if (choice.choice === 'Add Department') {
        // let intern = await internFunction();
        let menu = await mainMenu();
    }

    else {
        return
    }
}

const viewAllEmployees = async () => {
    //console.log all the employees
}

const addEmployee = async () => {
    //Add an employee
}

const updateEmployeeRole = async () => {
    //Update Employee Role
}

const viewAllRoles = async () => {
    //view all roles
}

const addRole = async () => {
    //Add a role
}

const viewAllDepartments = async () => {
    //View All Departments
}

const addDepartment = async () => {
    //Add a department
}