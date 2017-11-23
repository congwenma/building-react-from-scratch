'use strict';

const Reconciler = require('./Reconciler');
const ChildReconciler = require('./ChildReconciler');
const traverseAllChildren = require('./traverseAllChildren');

const DOM = require('./DOM');

const UPDATE_TYPES = {
  INSERT: 1,
  MOVE: 2,
  REMOVE: 3,
};

// NOTE: returns action-like objects. `type` defines the action name
const OPERATIONS = {
  insert(component, node, afterNode) {
    return {
      type: UPDATE_TYPES.INSERT,
      content: node,
      toIndex: component._mountIndex,
      afterNode: afterNode,
    };
  },

  move(component, afterNode, toIndex) {
    return {
      type: UPDATE_TYPES.MOVE,
      fromIndex: component._mountIndex,
      toIndex: toIndex,
      afterNode: afterNode,
    };
  },

  remove(component, node) {
    return {
      type: UPDATE_TYPES.REMOVE,
      fromIndex: component._mountIndex,
      fromNode: node,
    };
  },
};

// NOTE: gets all children into a flattened context:
// NOTE:   { .0.0: element1, .1.0: element2 }
function flattenChildren(children) {
  let flattenedChildren = {};
  traverseAllChildren(
    children,
    (context, child, name) => (context[name] = child),
    flattenedChildren,
  );

  return flattenedChildren;
}

// WARN: what is react doing!?
// In React we do this in an injection point, allowing MultiChild to be used
// across renderers. We don't do that here to reduce overhead.
// NOTE: actually processing `OPERATION` objects
function processQueue(parentNode, updates) {
  updates.forEach(update => {
    switch (update.type) {
      case UPDATE_TYPES.INSERT:
        DOM.insertChildAfter(parentNode, update.content, update.afterNode);
        break;

      case UPDATE_TYPES.MOVE:
        DOM.insertChildAfter(
          parentNode,
          parentNode.childNodes[fromIndex],
          update.afterNode,
        );
        break;

      case UPDATE_TYPES.REMOVE:
        DOM.removeChild(parentNode, update.fromNode);
        break;

      default:
        assert(false);
    }
  });
}

class MultiChild {
  mountChildren(children) {
    // Instantiate all of the actual child instances into a flat object. This
    // handles all of the complicated logic around flattening subarrays.
    let renderedChildren = ChildReconciler.instantiateChildren(children);

    /*
    {
      '.0.0': {_currentElement, ...}
      '.0.1': {_currentElement, ...}
    }
    */

    // Store the reference, we'll need this when updating.
    this._renderedChildren = renderedChildren;

    // We'll turn that renderedChildren object into a flat array and recurse,
    // mounting their children.
    let mountImages = Object.keys(renderedChildren).map((childKey, i) => {
      let child = renderedChildren[childKey];

      child._mountIndex = i;

      return Reconciler.mountComponent(child);
    });

    return mountImages;
  }

  unmountChildren() {
    ChildReconciler.unmountChildren(this._renderedChildren);
  }

  // NOTE: @params - [<Element>]
  updateChildren(nextChildren) {
    // NOTE: this is previously rendered[<Components>]
    let prevRenderedChildren = this._renderedChildren;

    let mountImages = [];
    let removedNodes = {};

    let nextRenderedChildren = flattenChildren(nextChildren);

    // NOTE: updates `removedNodes` so that we can remove these later.
    ChildReconciler.updateChildren(
      prevRenderedChildren,
      nextRenderedChildren,
      mountImages,
      removedNodes,
    );

    // The following is the bread & butter of React. We'll compare the current
    // set of children to the next set.
    // We need to determine what nodes are being moved around, which are being
    // inserted, and which are getting removed. Luckily, the removal list was
    // already determined by the ChildReconciler.

    // WARN: bookmark
    // We'll store a serious of update operations here.
    let updates = [];

    let lastIndex = 0;
    let nextMountIndex = 0;
    let lastPlacedNode = null;

    Object.keys(nextRenderedChildren).forEach((childKey, nextIndex) => {
      let prevChild = prevRenderedChildren[childKey];
      let nextChild = nextRenderedChildren[childKey];

      // If the are identical, record this as an update. We might have inserted
      // or removed nodes.
      // NOTE: if component vs component comparison
      if (prevChild === nextChild) {
        // WARN: not understanding what this `move` OPERATION is doing (shouldn't this be an update if its same component?), defering to place wehre `updates`<Array> is being consumed
        // We don't actually need to move if moving to a lower index. Other
        // operations will ensure the end result is correct.
        if (prevChild._mountIndex < lastIndex) {
          updates.push(OPERATIONS.move(prevChild, lastPlacedNode, nextIndex));
        }
        lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        prevChild._mountIndex = nextIndex;
      } else {
        // Otherwise we need to record an insertion. Removals will be handled below
        // First, if we have a prevChild then we know it's a removal.
        // We want to update lastIndex based on that.
        if (prevChild) {
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
        }

        nextChild._mountIndex = nextIndex;
        updates.push(
          OPERATIONS.insert(
            nextChild,
            mountImages[nextMountIndex],
            lastPlacedNode,
          ),
        );
        nextMountIndex++;
      }

      // NOTE: used as `afterNode` by `OPERATIONS`, not sure what this keep track is accomplishing other than maybe order
      lastPlacedNode = nextChild._domNode;
    });

    // Enqueue removals
    Object.keys(removedNodes).forEach(childKey => {
      updates.push(
        OPERATIONS.remove(
          prevRenderedChildren[childKey],
          removedNodes[childKey],
        ),
      );
    });

    // NOTE: updates is a list of `OPERATIONS`
    processQueue(this._domNode, updates);

    this._renderedChildren = nextRenderedChildren;
  }
}

module.exports = MultiChild;
