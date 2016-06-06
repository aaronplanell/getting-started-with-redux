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

const { createStore } = Redux;
const store = createStore(counter);

const Counter = React.createClass({
  render: function () {
    return (
      <div>
        <h1>{this.props.value}</h1>
        <button onClick={this.props.onIncrement}>+</button>
        <button onClick={this.props.onDecrement}>-</button>
      </div>
    );
  }
});

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={ () => store.dispatch({ type: 'INCREMENT' })}
      onDecrement={ () => store.dispatch({ type: 'DECREMENT' })}
      />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
