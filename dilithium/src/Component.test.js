import Component from 'Component'

class Test extends Component {
  render() { }
}

describe('Component', () => {
  const name = 'test component'
  let component
  beforeEach(() => {
    component = new Test({ name });
  })

  describe('constructor', () => {
    it("sets up props from the constructor", () => {
      expect(component.props).toEqual({ name });
    });
  })

  describe('setState', () => {
    let performUpdateIfNecessarySpy
    beforeEach(() => {
      performUpdateIfNecessarySpy = jest.spyOn(component, "performUpdateIfNecessary")
    })

    it('triggers change', () => {
      component.setState({ counter: 1 })
      expect(performUpdateIfNecessarySpy).toHaveBeenCalled()
    })
  })
})