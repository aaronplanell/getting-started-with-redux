/*
 * The reducers
 ***/

//Todo. One thing.
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
          id: action.id,
          text: action.text,
          completed: false //The default value
      };
    case 'TOGGLE_TODO':
      //Here the state is the individual todo, no de todo list.
      if (state.id !== action.id) {
        return state;
      } else {
        //Returns the same todo but with the completed flag flipped
        return {
            ...state,
            completed: !state.completed
        };
      }
    default:
      return state;
    }
};

//The list of todos
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      //Returns a new array. One item it's a new copy and it's toggled.
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

//The filter applied
const visibilityFilter = (
  state = 'SHOW_ALL', //The default initial state is SHOW_ALL
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

//Using the combineReducers operation, but with ES6
const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});


/*
 * Auxiliar function for apply the visibility
 ***/
const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    default:
      return todos;
  }
}


/*
 * Create the application
 ***/
const { createStore } = Redux;
const store = createStore(todoApp);

//Create the react component usiing the extension of React
const { Component } = React;

//The filter component
const FilterLink = ({
  filter,         //The string with the filter's name
  currentFilter,  //Current filter selected. It helps to bold the chosen one
  children        //The text of the link
}) => {
  //If the current filter is the filter selected we don't want that it will be clickable
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
      <a href='#'
        onClick={ e => {
          // Prevent that the default action of the event will not be triggered.
          e.preventDefault();
          //Call to our store function for filtering
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter //Pass the parameter filter from the call
          });
        }}
      >
        {children}
      </a>
  );
};

//The ToDo component
let nextTodoId = 0;
class TodoApp extends Component {
  render() {

    //Map the todos/visibilityFilter fields
    const {
      todos,
      visibilityFilter
    } = this.props;

    //Calculate the visible ToDos
    const visibleTodos = getVisibleTodos(todos,visibilityFilter);

    //Calc the render
    return (
      <div>
        <input ref={node => {
          this.input = node;
        }} />
        <button onClick={ () => {
          //Call to the action of addint a ToDo
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,
            id: nextTodoId++
          });
          //After add a ToDo clean the input
          this.input.value = '';
        }}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo =>
            <li key={todo.id}
              onClick={ () => {
                store.dispatch({
                  type: 'TOGGLE_TODO',
                  id: todo.id
                })
              }}
              style={{
                textDecoration:
                  todo.completed ? 'line-through' : 'none'
              }}
              >
              {todo.text}
            </li>
          )}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </div>
    )
  }
}

//Rendering into the Root Div
const render = () => {
  ReactDOM.render(
    <TodoApp
      //Spread all the Store fields to the this.props
      {...store.getState()}
    />,
    document.getElementById('root')
  );
};

//If the store receive any change it will render the new information
store.subscribe(render);

//First call to our render for showing the data for the first time
render();
