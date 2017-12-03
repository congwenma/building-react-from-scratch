# update
```javascript
starting from `Component#setState`(state) ->

1. set `@_pendingState` to `state`
2. invokes `UpdateQueue.enqueueSetState` on (component, state) ->
  2.1. reassign '@_pendingState' to `{...component.state, ...state}`

  2.2. invokes `Reconciler.performUpdateIfNecessary` on `component` ->
  invokes `component.performUpdateIfNecessary` ->
  invokes `component.updateComponent(
    @_currentElement: prevElement, @_currentElement: nextElement
  )` ->
    2.2.0. // Actual update starts here, lifecycle methods ignored in this implementation
    2.2.1. set `@_currentElement` to `nextElement`
    2.2.2. set `@state` to `@_pendingState`, which was set in 1 and 2.1

    2.2.3. unset `@_pendingState`

    2.2.4. set local variable `prevRenderedelement` to, `@_renderedComponent._currentElement`, which potentially was rendered in a previous mount
    2.2.5. set local variable `nextRenderedelement` `@render()`

    2.2.6. invokes `shouldUpdateComponent(prevRenderedElement, nextRenderedElement)` ->
      2.2.6.1. return true if `prev` and `next` are of same `type`.

    2.2.7. if 2.2.6 is true, "update" by invoking `Reconciler.receiveComponent(
      @_renderedComponent, nextRenderedElement
    )` ->
      2.2.7.1. conditional optimization if babels inline-element transformation is applied
      2.2.7.2. invokes `component.receiveComponent(element)` ->
      invokes `Component#updateComponent(@_currentElement, nextElement)` ->
        2.2.7.2.1. set @_currentElement to `nextElement`
        2.2.7.2.2. invoke `@_updateDOMProperties(prevElement.props, nextElement.props)` to update DOMComponent properties for its native attributes
        2.2.7.2.3. invokes `@_updateDOMChildren(prevElement.props, nextElement.props)` ->
          2.2.7.2.3.1. update either `@_domNode.textContent` or invoke `@updateChildren)` ->
            2.2.7.2.3.1.1. invokes ` ChildReconciler.updateChildren` on {
              prevRenderedChildren: @_renderedChidren,
              nextRenderedChildren: flattenChildren(nextChildren),
              mountImage: [], // to be mutated
              removedNodes: [] // to be mutated
            } ->
              2.2.7.2.3.1.1.1 compares `prevChildren` and `nextChildren` and update the component or removes it

            // Core logic of react
            2.2.7.2.3.1.2. determine what nodes are being moved around, which can be inserted, moved or removed. start a `queue` (A list of actions) and begin processing the `queue` on `@_domNode`


    2.2.8. if 2.2.6 is false, "remount" ->
      2.2.8.1. invokes `Reconciler.unmountComponent(@_renderedComponent)` ->
      invokes `@unmountcomponent`
        2.2.8.1.1

      2.2.8.2. set local variable `nextRenderedComponent` to `instantiateComponent(nextRenderedElement)` ->
        2.2.8.2.1.

      2.2.8.3. set local variable `nextMarkup` to `Reconciler.mountComponent(nextRenderedComponent)` ->
        2.2.8.3.1.

      2.2.8.4. invoke `DOM.replaceNode(
        @_renderedComponent._domNode,
        nextMarkup
      );` ->
        2.2.8.4.1.

      2.2.8.5. set `@_renderedComponent` to `nextRenderedComponent`, from 2.2.8.2

3. end

```