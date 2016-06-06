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
 * The react components
 ***/

//Create the react component using the extension of React
const { Component } = React;

//Create the connect function of React Redux
const { connect } = ReactRedux;


/*
 * Init of the AddTodo component
 ***/
let nextTodoId = 0;
let AddTodo = ({ dispatch }) => {
  let input;
  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={ () => {
        //Call to the action of addint a ToDo
        dispatch({
          type: 'ADD_TODO',
          text: input.value,
          id: nextTodoId++
        })
        //After add a ToDo clean the input
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);


/*
 * Init of the VisibleTodoList component
 ***/

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

//Refactor the VisibleTodoList
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};
const mapDispatchTodoListToProps = (dispatch) => {
    return {
      onTodoClick: (id) =>
        dispatch({
          type: 'TOGGLE_TODO',
          id
        })
    };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchTodoListToProps
)(TodoList);


/*
 * Init of the Footer component
 ***/

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

//The FilterLink component
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};
const MapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
};
const FilterLink = connect(
  mapStateToLinkProps,
  MapDispatchToLinkProps
)(Link);

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


/*
 * The ToDoApp component
 ***/
const TodoApp = () => {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  );
}

/*
 * Create the application
 ***/
const { Provider } = ReactRedux;
const { createStore } = Redux;

//Render the component
ReactDOM.render(
  <Provider store={createStore(todoApp)} >
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
