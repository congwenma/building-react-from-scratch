import Mount from 'Mount'
import { createElement } from 'Element'
import Reconciler from 'Reconciler'
import DOMComponentWrapper from 'DOMComponentWrapper'

let {
  render, unmountComponentAtNode,
  ROOT_KEY, instancesByRootID
} = Mount

describe('Mount.js', () => {
  const element = {
    type: 'div',
    props: { id: 'MountTest', children: 'content' },
  }
  describe('#render ->', () => {
    describe('#mount', () => {
      beforeEach(() => {
        document.body.innerHTML = `<div id="app"></div>`;
        render(element, document.getElementById("app"))
      })

      it('pass and renders the given element', () => {
        const appDiv = document.getElementById("app");
        expect(appDiv.innerHTML)
          .toBe(`<div id="MountTest">content</div>`)
      })

      it('sets instancesByRootID', () => {
        expect(instancesByRootID).toEqual(
          expect.objectContaining({
            2: expect.any(DOMComponentWrapper)
          })
        )
      })

      describe('#update', () => {
        let reconcilerSpy
        beforeEach(() => {
          reconcilerSpy = jest.spyOn(Reconciler, 'unmountComponent')
        })
        it('pass and renders the given element', () => {
          expect(reconcilerSpy).not.toHaveBeenCalled()
          const appDiv = document.getElementById("app")
          render(element, appDiv); // INVOKES the update

          expect(reconcilerSpy).toHaveBeenCalled()
          expect(appDiv.innerHTML)
            .toBe(`<div id="MountTest">content</div>`)
        })
      })
    })
  })
})