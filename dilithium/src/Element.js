'use strict';

// NOTE: @returns <Element> - { type, props }
function createElement(type, config, children) {
  // Clone the passed in config (props). In React we move some special
  // props off of this object (keys, refs).
  let props = Object.assign({}, config);

  // WARN: confusing, this only checks if there is a third parameter passed in, if so, `childCount === 1`
  // Build props.children. We'll make it an array if we have more than 1.
  let childCount = arguments.length - 2;
  if (childCount === 1) {
    props.children = children;
  } else if (childCount > 1) {
    props.children = Array.prototype.slice.call(arguments, 2);
  }

  // React Features not supported:
  // - keys
  // - refs
  // - defaultProps (usually set here)

  return {
    type,
    props,
  };
}

function isValidElement(element) {
  let typeofElement = typeof element;
  let typeofType = element.type && typeof element.type;
  return (
    typeofElement === 'string' ||
    typeofElement === 'number' ||
    typeofType === 'string' ||
    (typeofType === 'function' && element.type.isDilithiumClass)
  );
}

module.exports = {
  createElement,
  isValidElement,
};
