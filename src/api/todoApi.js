import axios from 'axios';

export async function fetchTodos() {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_limit=30`
  );
  return response.data;
}

export async function fetchTodo(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  console.log(response);
  return response.data;
}
export async function addTodo(newTodo) {
  const response = await axios.post(
    `https://jsonplaceholder.typicode.com/todos`,
    newTodo
  );
  console.log(response);
  return response.data;
}

export async function deleteTodo(id) {
  const response = await axios.delete(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  console.log(response);
  return response.data;
}

export async function updateTodo(todo) {
  const response = await axios.put(
    `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
    todo
  );
  console.log(response);
  return response.data;
}
