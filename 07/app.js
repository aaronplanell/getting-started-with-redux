const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
    }
}

//Create our own createStore function
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    //Function for remove this listener from the listener array
    return () => {
      listeners = listeners.filter( l => l !== listener );
    };
  };

  //To get the initial state populated
  dispatch({});

  return {getState, dispatch, subscribe};

};
const store = createStore(counter);

const render = () => {
  document.body.innerText = store.getState();
};
store.subscribe(render);
render();

document.addEventListener('click', () => { store.dispatch ( { type: 'INCREMENT' }) });
