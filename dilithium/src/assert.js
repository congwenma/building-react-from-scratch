'use strict';

// Lightweight replacement for invariant/node assert

function assert(condition) {
  if (!condition) {
    throw new Error('assertion failure');
  }
}

// BETTER: modified assert;
assert.better = (arg1, arg2) => {
  if (arg1 !== arg2) {
    console.error(`inequal expressions given: 1. ${arg1}, 2. ${arg2}`)
  }
  assert(arg1 === arg2);
}
module.exports = assert