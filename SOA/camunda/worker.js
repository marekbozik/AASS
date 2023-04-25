import { Client, logger, Variables } from 'camunda-external-task-client-js';
import mysql from 'mysql2/promise';


//const pool = mysql.createConnection('mysql://6an9exq91jm3ebbi7zro:pscale_pw_uZHsSNsDGes6JxpiGrmMkfEdf34xfVGG64xOXVOF48J@aws.connect.psdb.cloud/ais?ssl={"rejectUnauthorized":true}');
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };
const client = new Client(config);
const pool = mysql.createPool({
  host: 'aws.connect.psdb.cloud',
  user: '6an9exq91jm3ebbi7zro',
  password: 'pscale_pw_uZHsSNsDGes6JxpiGrmMkfEdf34xfVGG64xOXVOF48J',
  database: 'ais',
  ssl: {
    rejectUnauthorized: false
  }
});

// execute a query asynchronously
async function getUsers(studentId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM User WHERE Id = ${studentId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getSubject(subjectId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM ais.Group WHERE Id = ${subjectId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getRegistration(studentId, subjectId) {
  try {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(`SELECT * FROM GroupMembers WHERE UserId = ${studentId} AND GroupId = ${subjectId}`);
    connection.release();
    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function createRegistration(studentId, subjectId) {
  try {
    const connection = await pool.getConnection();
    //const [rows, fields] = 
    await connection.execute(`INSERT INTO GroupMembers (UserId, GroupId) VALUES (${studentId}, ${subjectId})`);
    connection.release();
    //return rows;
  } catch (error) {
    console.error(error);
  }
}

client.subscribe('auth', async function({ task, taskService }) {

  console.log('task 1: authenticate user');
  //subjectId, studentId
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  const rows = await getUsers(studentId);
  const outputVariables = new Variables();

  if (rows.length == 0) {
    const registrationSucessfull = -1;
    console.log('task 1: authentication failed');
    outputVariables.set('registrationSucessfull', registrationSucessfull);
  }


  console.log('task 1: authentication successfull');
  const authValue = 1;
  outputVariables.set('auth', authValue);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);

  // Complete the task
  await taskService.complete(task, outputVariables);
});

client.subscribe('get-subject', async function({ task, taskService }) {

  console.log('task 2: get subject');
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  const rows = await getSubject(subjectId);
  const outputVariables = new Variables();

  if (rows.length == 0) {
    const registrationSucessfull = -1;
    console.log('task 2: subject does not exist');
    outputVariables.set('registrationSucessfull', registrationSucessfull);
  }

  console.log('task 2: subject exists');

  const subjectExists = 1;
  outputVariables.set('subjectExists', subjectExists);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);

  // Complete the task
  await taskService.complete(task, outputVariables);
});

client.subscribe('get-user-registration', async function({ task, taskService }) {

  console.log('task 3: get user registration');
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  const rows = await getRegistration(studentId, subjectId);
  const outputVariables = new Variables();

  if (rows.length != 0) {
    const registrationSucessfull = -1;
    console.log('task 3: user already registered');
    outputVariables.set('registrationSucessfull', registrationSucessfull);
  }
  
  const registrationExists = 0;
  outputVariables.set('registrationExists', registrationExists);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);

  console.log('task 3: user not registered');
  // Complete the task
  await taskService.complete(task, outputVariables);
});

client.subscribe('register-subject', async function({ task, taskService }) {
  
  console.log('task 4: register user to subject');
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');
  let registrationAlreadySucessfull = task.variables.get('registrationSucessfull');
  
  if (registrationAlreadySucessfull == -1) {
    console.log('task 4: registration failed');
    registrationAlreadySucessfull = 0;
  } else {
    await createRegistration(studentId, subjectId);
    registrationAlreadySucessfull = 1;
  }

  const outputVariables = new Variables();
  const registrationSucessfull = registrationAlreadySucessfull;
  if (registrationSucessfull == -1) {
    console.log('task 4: registration failed');
  }
  outputVariables.set('registrationSucessfull', registrationSucessfull);
  
  console.log('task 4: user registered');

  // Complete the task
  await taskService.complete(task, outputVariables);

});

client.subscribe('finalize-registration', async function({ task, taskService }) {
  
  console.log('task 5: finalize registration');
  //set timeout
  setTimeout(async () => {

    // Complete the task
    await taskService.complete(task);
  }, 10000);
});
