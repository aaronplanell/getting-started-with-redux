/*
 * Definition of the functions
 ***/
const addCounter = (list) => {
  /*
   * Avoid modify the original array and return a new copy
   *  list.push(0);
   *  return list;
   ***/

   /*
    * Using the new operator
    *  return list.concat([0]);
    ***/
   return [...list, 0];
};


const removeCounter = (list, index) => {
  /*
   * Avoid modify the original array and return a new copy
   *  list.splice(index, 1);
   *  return list;
   ***/

   /*
    * Using the new operator
    *  return list
    *   .slice(0, index)
    *   .concat(list.slice(index+1));
    ***/

   return [
     ...list.slice(0, index),
     ...list.slice(index+1)
  ];
}

const incrementCounter = (index) => {
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index+1)
 ];
}

const decrementCounter = (index) => {
  return [
    ...list.slice(0, index),
    list[index] - 1,
    ...list.slice(index+1)
 ];
}


/*
 * Definition of the tests
 ***/
const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  //For review that the originalobject is not modified
  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [10, 20, 30];
  const listAfter = [10, 30];

  //For review that the originalobject is not modified
  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [10, 20, 30];
  const listAfter = [10, 21, 30];

  //For review that the originalobject is not modified
  deepFreeze(listBefore);

  expect(
    incrementCounter(1)
  ).toEqual(listAfter);
};

const testDecrementCounter = () => {
  const listBefore = [10, 20, 30];
  const listAfter = [10, 19, 30];

  //For review that the originalobject is not modified
  deepFreeze(listBefore);

  expect(
    incrementCounter(1)
  ).toEqual(listAfter);
};


/*
 * Running the tests
 ***/
testAddCounter();
testRemoveCounter();
console.log('All test passed!');
