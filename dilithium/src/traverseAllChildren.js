'use strict';

const SEPARATOR = '.';
const SUBSEPARATOR = ':';

function getComponentKey(component, index) {
  // This is where we would use the key prop to generate a unique id that
  // persists across moves. However we're skipping that so we'll just use the
  // index.

  // We'll convert this to base 36 for compactness.
  return index.toString(36);
}

function traverseAllChildren(children, callback, traverseContext) {
  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

// NOTE: @param `nameSoFar` - adds levels of separator
// NOTE:   lifecycle: [
// NOTE:      '.',
// NOTE:      '.2', // passed into recursion*
// NOTE:      '.2:'
// NOTE:      '.2:1' //  passed into next recursion
// NOTE:    ]
// NOTE: @param `callback` - `ChildReconciler.instantiateChild`, which invokes `initiateComponent`
// NOTE: @param `traverseContext` - understood as `childInstances` to keep track of children throughout the recursion. This is used to prevent
// NOTE:    reorder issues, b/c React will reuse an existing instance (found in traverseContext) if there is one in the subtree.
// NOTE:    builds something like this, {.0.0: DOMComponentWrapper, .1.0: ColorSwatch, .2.0: DOMComponentWrapper}
function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext,
) {
  // TODO: support null, undefined, booleans, numbers, iterators

  // NOTE: if theres only one child and its not Array, call `callback`, could be `instantiateChild(childInstances, child, name)`, and end
  // Handle a single child.
  if (typeof children === 'string' || !Array.isArray(children)) {
    // We'll treat this name as if it were a lone item in an array, as going from
    // a single child to an array is fairly common.

    // This callback gets called with traverseContext as an argument. This is
    // passed in from the reconciler and it used there to track the children.
    // NOTE: tracks the level of scoping for each traverse, through recursively invoking `traverseAllChildrenImpl` on each child
    callback(
      traverseContext,
      children,
      nameSoFar + SEPARATOR + getComponentKey(children, 0),
    );
    return 1;
  }

  // WARN: ?! whats there to support about iterators? maybe ES6 iterators?
  // WARN: ?! when would children be nested?, maybe when it returns an array? <div>{[<div>123</div>]}</div>
  // NOTE: `subTreeCount` keeps track of number of children.
  // Otherwise we have an array. React also supports iterators but we won't.
  // We need to return the number of children so start tracking that.
  // Note that this isn't simply children.length - since children can contain nested
  // arrays, we need to account for that too, as those are rendered at the same level.
  let subTreeCount = 0;
  let nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  // Loop over all children, generate the next key prefix, and then recurse!
  children.forEach((child, i) => {
    let nextName = nextNamePrefix + getComponentKey(child, i);
    subTreeCount += traverseAllChildrenImpl(
      child,
      nextName,
      callback,
      traverseContext,
    );
  });

  return subTreeCount;
}

module.exports = traverseAllChildren;
