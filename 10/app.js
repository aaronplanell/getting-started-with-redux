const toggleTodo = (todo) => {
  /*
   * Avoid modify the original array and return a new copy
   *  todo.completed = !todo.completed;
   *  return todo;
   ***/

   /*
    * Using the new operator
    *  return {
    *   id: todo.id,
    *   text: todo.text,
    *   completed: !todo.completed
    *  }
    ***/

    /*
     * And finally, we comment the code and do the same but with ES7
     *  return Object.assign({}, todo, {
     *   completed: !todo.completed
     *  });
     ***/
     return {
       ...todo,
       completed: !todo.completed
     };
};

const testToggleTodo = () => {
  const todoBefore = {
    id: 0,
    text: 'Learn Redux',
    completed: false
  };

  const todoAfter = {
    id: 0,
    text: 'Learn Redux',
    completed: true
  };

  deepFreeze(todoBefore);

  expect(
    toggleTodo(todoBefore)
  ).toEqual(todoAfter);
};

testToggleTodo();
console.log('All tests passed!');
