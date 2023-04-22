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
  // Put your business logic here

  // Get a process variable
  const amount = task.variables.get('amount');
  const item = task.variables.get('item');

  const outputVariables = new Variables();
  const authValue = 1;
  outputVariables.set('auth', authValue);

  console.log(`Charging credit card with an amount of ${amount}€ for the item '${item}'...`);

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

  console.log('task 2: som tu a sedim na vajci');

  // Complete the task
  await taskService.complete(task, outputVariables);

  await taskService.handleFailure(task, {
    errorMessage: 'An error occurred',
    errorDetails: 'Something went wrong',
    retries: 0,
    retryTimeout: 100000000
  });
});

