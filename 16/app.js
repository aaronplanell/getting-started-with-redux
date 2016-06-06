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
          completed: false
      };
    case 'TOGGLE_TODO':
      //Here the state is the individual todo, no de todo list.
      if (state.id !== action.id) {
        return state;
      } else {
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

//Scratching the combineReducers function
const combineReducers = (reducers) => {
  //The combineReducers is a function that returns another function
  //With the same parameters that a normal reducer
  return (state = {}, action) => {
    //That function returns the state, that is composed with the different keys
    //Of the different reducers. If a key is repeated in two reducers, wins the last one.
    return Object.keys(reducers).reduce(
      //Acumulate the different parts of the state
      (nextState, key) => {
        //Call to the state of every reducer
        nextState[key] = reducers[key](
          state[key],
          action
        );
        return nextState;
      },
      //Combine first with and empty object
      {}
    );
  };
};


//The Todo Application: array of todos + visibility
//Using the combineReducers operation, but with ES6
const todoApp = combineReducers({
  todos,
  visibilityFilter
});


/*
 * Create the application
 ***/
const { createStore } = Redux;
const store = createStore(todoApp);


/*
 * Playing with our application
 ***/
console.log('Initial state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 0,
  text: 'Learn Redux'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO');
store.dispatch({
  type: 'ADD_TODO',
  id: 1,
  text: 'Go shopping'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching TOGGLE_TODO');
store.dispatch({
  type: 'TOGGLE_TODO',
  id: 0
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching SET_VISIBILITY_FILTER');
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
});
console.log('Current state:');
console.log(store.getState());
console.log('--------------');
