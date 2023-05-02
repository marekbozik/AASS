import { Client, logger, Variables } from 'camunda-external-task-client-js';
import { getUsers, getSubject, getRegistration, createRegistration } from './db.js';
import { exec } from 'child_process';

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };
const client = new Client(config);

exec('open -n -a /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --args --user-data-dir="/tmp/chrome_dev_sess_1" --disable-web-security', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

client.subscribe('auth', async function ({ task, taskService }) {

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

client.subscribe('get-subject', async function ({ task, taskService }) {

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

client.subscribe('get-user-registration', async function ({ task, taskService }) {

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

client.subscribe('register-subject', async function ({ task, taskService }) {

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

client.subscribe('finalize-registration', async function ({ task, taskService }) {

  console.log('task 5: finalize registration');
  //set timeout
  setTimeout(async () => {

    // Complete the task
    await taskService.complete(task);
  }, 10000);
});
