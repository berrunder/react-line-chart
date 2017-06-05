import React from 'react'
import PropTypes from 'prop-types'
import {range} from '../utils'

class LineBox extends React.PureComponent {
  render() {
    const {stroke, lineCount, height, width, x, y, fontSize, fontColor, maxValue} = this.props;

    if (lineCount <= 0) {
      return null;
    }

    const step = height / (lineCount - 1);
    const labelStep = maxValue / (lineCount - 1);

    return <g stroke={stroke} fontSize={fontSize}>
      {range(lineCount)
        .map(idx => {
          const y1 = y + idx * step;
          const label = (maxValue - labelStep * idx).toFixed(0);

          return <g key={idx}>
            <text x={x - 5} y={y1} textAnchor="end" fill={fontColor} stroke="none">{label}</text>
            <line x1={x} y1={y1} x2={x + width} y2={y1}/>
          </g>
        })}
    </g>;
  }
}

LineBox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  lineCount: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontColor: PropTypes.string.isRequired
};

export default LineBox;