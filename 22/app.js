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

//The ToDo component
const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ? 'line-through' : 'none'
    }}
    >
    {text}
  </li>
);

//The ToDoList component
const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map (todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick = { () => onTodoClick(todo.id)}
      />
    )}
  </ul>
);

//The AddTodo component
const AddTodo = ({
  onAddClick
}) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={ () => {
        //Call to the action of addint a ToDo
        onAddClick(input.value);
        //After add a ToDo clean the input
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

//The filter component
const Link = ({
  active,
  children, //The text of the link
  onClick   //The function
}) => {
  //If the current filter is the filter selected we don't want that it will be clickable
  if (active) {
    return <span>{children}</span>;
  }
  return (
      <a href='#'
        onClick={ e => {
          // Prevent that the default action of the event will not be triggered.
          e.preventDefault();
          //Call to our store function for filtering
          onClick();
        }}
      >
        {children}
      </a>
  );
};

class FilterLink extends Component {
  //When the component mount param the store for forcing the update when the store is changed
  componentDidMount() {
    //We save the unsubscribe for the unmount
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  //The unmount
  componentWillUnmount() {
    this.unsubscribe();
  }

  render () {
    const props = this. props;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        {props.children}
      </Link>
    );
  }
}

//The footer component
const Footer = () => {
  return(
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'
      >
        All
      </FilterLink>
      {', '}
      <FilterLink
        filter='SHOW_ACTIVE'
      >
        Active
      </FilterLink>
      {', '}
      <FilterLink
        filter='SHOW_COMPLETED'
      >
        Completed
      </FilterLink>
    </p>
  );
};

//The ToDoApp component
let nextTodoId = 0;
const TodoApp = ({
  todos,
  visibilityFilter
}) => {
  return (
    <div>
      <AddTodo
        onAddClick={text =>
          store.dispatch({
            type: 'ADD_TODO',
            text,
            id: nextTodoId++
          })
        }
      />
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
      <Footer/>
    </div>
  );
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
