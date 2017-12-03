# Definitions
`<Component>` - `DOMComponentWrapper` / `Component`(Composite), both extends from MultiChild

`<Element>` - an object representation of an element, e.g.:
  {
    type: 'div' || MyCompoennt,
    props: { children }
  }



# Variables
## DOMComponentWrapper
- @_currentElement <Element>
- @_domNode <DOMNode>

## Component(Composite)
- @_currentElement <Element>
- @_pendingState <State object>
- @_renderedComponent <Component> - direct child component, used for traversing
- @_renderedNode <DOMNode> - equivalent of `@_domNode` on `DOMComponentWrapper`