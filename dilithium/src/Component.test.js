import Component from 'Component'
import { render, unmountComponentAtNode } from "Mount"
import Element from 'Element'
import Reconciler from 'Reconciler'
import DOMComponentWrapper from "DOMComponentWrapper"

const { createElement } = Element

let testInst = null
class Test extends Component {
  constructor(props) {
    super(props)
    testInst = this
  }
  render() {
    const { counter } = this.state || {}
    // return { type: 'div', children: [] }
    return createElement("div", null, // type // props,
      // children
      createElement("h1", null, this.props.name), createElement("span", null, counter ? `counter: ${counter}` : ""));
  }
}

describe('Component', () => {
  const name = 'hello world'
  beforeEach(() => {
    document.body.innerHTML = `<div id="app"></div>`;
    render(
      createElement(Test, { name }),
      document.getElementById('app')
    )
  })
  // afterEach(() => unmountComponentAtNode(document.getElementById('app')))

  describe('.constructor', () => {
    it("sets up props from the constructor", () => {
      expect(testInst.props).toEqual({ name });
    });
  })

  describe('#setState', () => {
    let performUpdateIfNecessarySpy
    beforeEach(() => {
      performUpdateIfNecessarySpy = jest.spyOn(testInst, "performUpdateIfNecessary");
    })

    it('triggers change', () => {
      const appDiv = document.getElementById("app");
      expect(appDiv.innerHTML).toBe(`
        <div><h1>hello world</h1><span></span></div>
      `.trim());

      // here's the actual test
      testInst.setState({ counter: 1 });
      expect(performUpdateIfNecessarySpy).toHaveBeenCalled()
      expect(appDiv.innerHTML).toBe(`
        <div><h1>hello world</h1><span>counter: 1</span></div>
      `.trim())
    })
  })

  describe('#mountComponent', () => {
    let renderSpy
    let reconcilerMountComponentSpy
    beforeEach(() => {
      jest.clearAllMocks();
      renderSpy = jest.spyOn(testInst, 'render')
      reconcilerMountComponentSpy = jest.spyOn(Reconciler, 'mountComponent')

      expect(renderSpy).not.toHaveBeenCalled()
      expect(reconcilerMountComponentSpy).not.toHaveBeenCalled();
      testInst.mountComponent()
    })

    // NOTE: cannot separate this into multiple it statements, there are potential problems running the setup multiple times
    it('invokes `render`, Reconciler.mountComponent` and set `@_renderedComponent`', () => {
      expect(renderSpy).toHaveBeenCalled();
      expect(reconcilerMountComponentSpy).toHaveBeenCalled();
      expect(testInst._renderedComponent).toBeDefined();
      expect(testInst._renderedComponent.constructor).toBe(DOMComponentWrapper);
    })
  })
})