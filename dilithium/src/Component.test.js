import Component from 'Component'
import { render } from "Mount";
import Element from 'Element'
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
      // console.log(document.body.innerHTML)
      expect(appDiv.innerHTML).toBe(`
        <div><h1>hello world</h1><span></span></div>
      `.trim());
      testInst.setState({ counter: 1 });
      expect(performUpdateIfNecessarySpy).toHaveBeenCalled()
      expect(appDiv.innerHTML).toBe(`
        <div><h1>hello world</h1><span>counter: 1</span></div>
      `.trim())
    })
  })
})