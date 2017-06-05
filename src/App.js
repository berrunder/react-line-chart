import React, {Component} from 'react'
import './App.css'
import LineChart from './components/LineChart'

const rnd = (from, to) => from + Math.random() * (to - from);
const randomInt = (from, to) => Math.round(rnd(from, to));

const generateData = () => {
  let data = [];
  let i = 0;

  while (i < 40) {
    const newPoint = [Date.UTC(2015, randomInt(0, 11), randomInt(1, 31)), rnd(19, 79)]
    if (data.every(point => Math.abs(point[0] - newPoint[0]) > 24 * 60 * 60 * 1000)) {
      data.push(newPoint);
      i++;
    }
  }

  data.sort((a, b) => a[0] - b[0]);

  return data;
}

const btnStyle = {marginBottom: '2em'};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: generateData()
    }
  }

  handleClick = () => {
    this.setState({data: generateData()})
  }

  render() {
    return (
      <div className="App">
        <button style={btnStyle} onClick={this.handleClick}>Перегенерировать данные</button>
        <LineChart
          title="2015"
          data={this.state.data}
        />
      </div>
    );
  }
}

export default App;
