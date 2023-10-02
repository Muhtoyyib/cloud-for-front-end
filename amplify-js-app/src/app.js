import { Amplify, API, graphqlOperation } from 'aws-amplify';

import awsconfig from './aws-exports';
import { createTodo } from './graphql/mutations';
import { listTodos } from "./graphql/queries";
import { onCreateTodo } from "./graphql/subscriptions";

Amplify.configure(awsconfig);

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');
const QueryResult = document.getElementById("QueryResult");
const SubscriptionResult = document.getElementById("SubscriptionResult");

async function createNewTodo() {
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  
  const todo = {
    name,
    description
  };
  
  return await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

const todoForm = document.getElementById('TodoForm');
todoForm.addEventListener('submit', (event) => {
  event.preventDefault(); 
  createNewTodo().then((evt) => {
    console.log(evt.data.createTodo);
    MutationResult.innerHTML = `<p>${evt.data.createTodo.name} - ${evt.data.createTodo.description}</p>`;
  });
});


async function getData() {
      API.graphql(graphqlOperation(listTodos)).then((evt) => {
        evt.data.listTodos.items.map((todo) => {
         QueryResult.innerHTML = `<p>${todo.name} - ${todo.description}</p>`;
       });
     });
}


API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (evt) => {
        const todo = evt.value.data.onCreateTodo;
        SubscriptionResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`;
      },
});

getData();