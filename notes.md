# Mounting
ReactDOM.render (<Element>, <DOMNode>)

```js
0. checks if `<DOMNode>` has `dataset-dlthm-root-id`,
2. if yes, update it. ->

1. if not, mounts it. ->
  1.1. set `dataset-dlthm-root-id` to `rootID`, which is an incremental number starting from 1

  1.2. `initiateComponent` on the `<Element>`. ->
    1.2.1 set `wrapperInstance` to a <Component> in this logic: ->

      1.2.1.1 check typeof `<Element>.type`
      1.2.1.2 if is String (div, span) then construct `wrapperInstance` with `HostComponent.construct(element)`
      1.2.1.3 if is Function (stateless or component) then construct `wrapperInstance` with: `new element.type(element.props)`
      1.2.1.4 check typeof `<Element>`, if its a 'string' or a 'number' (means its a textNode), construct with  `HostComponent.constructTextComponent(element)`

    1.2.2 return `wrapperInstance` <Component>

  1.3. set `<Component>` instance onto local hash `instancesByRootID[rootID]`

  # NOTE: Reconciler generally has DOM or Native (device) api for implementing the process, but here we are only calling `mountComponent`, no use for the second argument `node`
  1.4 call `Reconciler.mountComponent(component, node)` to render the `DOMNode`, ->
    -> return `component.mountComponent()` ->
    1.4.0. Polymorphic invocation which could trigger `mountComponent` on either `DOMComponentWrapper` or `CompositeComponent`

    1.4.1. `DOMComponentWrapper` ->
      1.4.1.1. create `<HTMLTag>` using `@_currentElement.type`
      1.4.1.2. set 1.4.1.1 to `@_domNode`
      1.4.1.3. calls `@_updateDOMProperties({}, @_currentElement.props` to update props ->
        1.4.1.3.1. update native attributes

      1.4.1.4. creates children elements stored on `@_currentElement.props.children`, calls `@_createInitialDOMChildren`, ->
        1.4.1.4.1. if children is 'string/number',  create/replace `.textContent`

        1.4.1.4.2. else calls `@mountChildren` and then mounts the `mountedImages`(!?`<DOMNode>`) to the `@_domNode`,
        calls `MultiChild.mountChildren`,
          1.4.1.4.2.1. calls `ChildReconciler.instantiateChildren` on `children`
            1.4.1.4.1.1. calls `traverseAllChildren` to get a `{ componentKey: value ...}` for all children.

          1.4.1.4.2.2. assigns output of 1.4.1.4.1 to `@_renderedChildren`

          1.4.1.4.2.3. for each children in 1.4.1.4.1, assign index `_mountIndex`, then call `Reconciler.mountComponent` on each

          1.4.1.4.2.4. `Recursion` occurs from 1.4.1.4.3 to 1.4, continue until all components are mounted and became markup (or `<HTMLTag>`), returns 1.4.1.4.2.3

        1.4.1.4.3. calls `DOM.appendChildren` on `@_domNode` and `mountedImages` (array of DOMNodes)
          1.4.1.4.4. -- `DOM.appendChildren(node, children)`, append `children` nodes to given `node`

      1.4.1.5 returns `<HTMLTag>`

    1.4.2. `CompsiteComponent` ->
      1.4.2.1. set `renderedElement` to `component.render()`
      1.4.2.2. set `renderedComponent` to `instantiateComponent` on 1.4.2.1
        1.4.2.2.1. check type, depending on type, construct either a `<DOMComponent>`, `<CompositeComponent>` or a `TextComponent`

      1.4.2.3. set 1.4.2.2 to a private variable `@_renderedComponent`

      1.4.4. set `markup` to `Reconciler.mountComponent` on `renderedComponent`, output of 1.4.2
      1.4.5. Recusion occurs on 1.4.4 to 1.4, repeat until all `renderedElement` are instantiated into `Components` and converted to `<HTMLTag>`.

    1.4.6 return `renderedMarkup` <HTMLTag>

  1.5 empties target <DOMNode>,

  1.6 appends rendered node to <DOMNode>

  1.7 increment `rootID`

```