import { Client, logger, Variables } from 'camunda-external-task-client-js';
import open from 'open';

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'asyncResponseTimeout': long polling timeout (then a new request will be issued)
const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger, asyncResponseTimeout: 10000 };

// create a Client instance with custom configuration
const client = new Client(config);

//susbscribe to the topic: 'charge-card'
client.subscribe('auth', async function({ task, taskService }) {

  //subjectId, studentId
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  console.log('task 1: som tu a cakam na vajci: ', subjectId, studentId);
  const outputVariables = new Variables();
  const authValue = 1;
  outputVariables.set('auth', authValue);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);


  // Complete the task
  await taskService.complete(task, outputVariables);

  await taskService.handleFailure(task, {
    errorMessage: 'An error occurred',
    errorDetails: 'Something went wrong',
    retries: 0,
    retryTimeout: 100000000
  });
});

client.subscribe('get-subject', async function({ task, taskService }) {

  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  console.log('task 2: som tu a sedim na vajci: ', subjectId, studentId);

  const outputVariables = new Variables();
  const subjectExists = 1;
  outputVariables.set('subjectExists', subjectExists);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);

  // Complete the task
  await taskService.complete(task, outputVariables);

  await taskService.handleFailure(task, {
    errorMessage: 'An error occurred',
    errorDetails: 'Something went wrong',
    retries: 0,
    retryTimeout: 100000000
  });
});

client.subscribe('get-user-registration', async function({ task, taskService }) {

  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');
  
  const outputVariables = new Variables();
  const registrationExists = 0;
  outputVariables.set('registrationExists', registrationExists);
  outputVariables.set('subjectId', subjectId);
  outputVariables.set('studentId', studentId);

  console.log('task 3: zniesol som vajicka a cakaju na teba: ',  subjectId, studentId);
  // Complete the task
  await taskService.complete(task, outputVariables);

  await taskService.handleFailure(task, {
    errorMessage: 'An error occurred',
    errorDetails: 'Something went wrong',
    retries: 0,
    retryTimeout: 100000000
  });
});

client.subscribe('register-subject', async function({ task, taskService }) {
  
  const subjectId = task.variables.get('subjectId');
  const studentId = task.variables.get('studentId');

  const outputVariables = new Variables();
  const registrationSucessfull = 1;
  outputVariables.set('registrationSucessfull', registrationSucessfull);

  console.log('task 4: hotovo: ', subjectId, studentId);

  // Complete the task
  await taskService.complete(task, outputVariables);

  await taskService.handleFailure(task, {
    errorMessage: 'An error occurred',
    errorDetails: 'Something went wrong',
    retries: 0,
    retryTimeout: 100000000
  });

});

client.subscribe('finalize-registration', async function({ task, taskService }) {
  
  console.log('task 5: finalizujem ');
  //set timeout
  setTimeout(async () => {

    // Complete the task
    await taskService.complete(task);

    await taskService.handleFailure(task, {
      errorMessage: 'An error occurred',
      errorDetails: 'Something went wrong',
      retries: 0,
      retryTimeout: 100000000
    });
  }, 100000);
});
