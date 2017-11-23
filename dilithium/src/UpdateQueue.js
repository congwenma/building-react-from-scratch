'use strict';

const Reconciler = require('./Reconciler');

// NOTE: @param {instance} - instance of {Component}
// NOTE: @param {partialState} - targeted state we want to get into
// NOTE: instead of triggering a batch update, this will just update the component
function enqueueSetState(instance, partialState) {
  // This is where React would do queueing, storing a series
  // of partialStates. The Updater would apply those in a batch later.
  // This is complicated so we won't do it today. Instead we'll update state
  // and then tell the reconciler this component needs to be updated, synchronously.

  // NOTE: create a new state and merge {old} and {target} states
  instance._pendingState = Object.assign({}, instance.state, partialState);

  Reconciler.performUpdateIfNecessary(instance);
}

module.exports = {
  enqueueSetState,
};
