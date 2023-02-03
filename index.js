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

    } else if (choice.choice === 'Exit') {
        return
    }
}

const getRoleLength = async () => {
    let [roleId] = await db.promise().query('SELECT role.role_id FROM role')
    if (roleId.length === 0) {
        return console.log("Sorry, there isn't anything in your table!");
    } else {
        return roleId.map(role => role.role_id)
    }
}

const getActiveRoles = async () => {
    let [col] = await db.promise().query('SELECT * FROM role');
    return col;
}

const getActiveDepartments = async () => {
    let [col] = await db.promise().query('SELECT * FROM department');
    return col;
}

const getActiveManagers = async () => {
    let [col] = await db.promise().query('SELECT first_name FROM employee WHERE role_id = 3');
    return col;
}

//==============Main functions=================
// &COMPLETED
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

    //Fix where it shows all departments, not just the department you selected
    const [[createdDepartment]] = await db.promise().query('SELECT * FROM department WHERE name = ?', answers.department_name);

    return console.table([createdDepartment]);
}

// &COmpleted
const viewAllDepartments = async () => {
    const [departments] = await db.promise().query('SELECT * FROM department');

    return console.table(departments);
}


//& COMPLETED
const viewAllEmployees = async () => {
    let [employees] = await db.promise().query('SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, department.name AS department_name, manager.first_name AS manager_name FROM employee LEFT JOIN role on (employee.role_id = role.role_id) LEFT JOIN department on (role.department_id = department.id) LEFT JOIN employee AS manager on (employee.manager_id = manager.employee_id)')

    return console.table(employees);
    }


//& COMPLETED
const addEmployee = async () => {
    const roles = await getActiveRoles();
    const managers = await getActiveManagers(); 
    console.log(managers)

    let map = roles.map (roles => {
        return ({
            name: roles.title,
            value: roles.role_id
        })
    })

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
};

//& COMPLETE
const addRole = async () => {
    let departments = await getActiveDepartments();
    console.log(departments)

    let map = departments.map (dept => {
        return ({
            name: dept.name,
            value: dept.id
        })
    })

    console.log(map);
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

//& COMPLETE
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
}

//& COMPLETED
const viewAllRoles = async () => {
    let [roles] = await db.promise().query('SELECT role.role_id, role.title, role.salary, department.name as department_name FROM role INNER JOIN department ON role.department_id = department.id;')

    return console.table(roles);
}

const init = async () => {
    let menu = await mainMenu();
}

init();