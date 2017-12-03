'use strict';

const Dilithium = require('../dilithium');

class CounterButton extends Dilithium.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    setInterval(() => {
      // TODO: learn by debugger;
      this.setState({count: this.state.count + 1});
    }, 100);
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <ColorSwatch number={this.state.count} />
        <div>Count: <span>{this.state.count}</span></div>
      </div>
    );
  }
}

class ColorSwatch extends Dilithium.Component {
  render() {
    const red = this.props.number * 10 % 256;
    return (
      <div
        style={{
          backgroundColor: `rgb(${red}, 0, ${red})`,
          height: '50px',
          width: '50px',
        }}
      />
    );
  }
}

debugger
// window.addEventListener('click', () => {
  Dilithium.render(
    <CounterButton title="Hello World" />,
    document.getElementById('container'),
  );
// });
