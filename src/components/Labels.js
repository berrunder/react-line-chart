import React from 'react'
import PropTypes from 'prop-types'
import {getLongMonth, memoizeLast} from '../utils'

const getMonths = memoizeLast(data => {
  const xPoints = data.map(point => point[0])

  const {xMax, xMin} = xPoints.reduce((acc, val) => {
    if (acc.xMax <= val) {
      acc.xMax = val;
    }

    if (acc.xMin >= val) {
      acc.xMin = val;
    }

    return acc;
  }, {xMax: 0, xMin: Number.MAX_VALUE});

  const currentDate = new Date(xMin);
  currentDate.setDate(1);
  const maxDate = new Date(xMax);
  maxDate.setDate(1);

  const months = [getLongMonth(currentDate)];

  while (currentDate < maxDate) {
    currentDate.setMonth(currentDate.getMonth() + 1);
    months.push(getLongMonth(currentDate));
  }

  return months;
});

class Labels extends React.PureComponent {
  render() {
    const props = this.props;
    const months = getMonths(props.data);
    const step = months.length > 0 ? (props.xRight - props.xLeft) / months.length
      : 0;

    return (
      <g fontSize={props.fontSize} fill={props.fontColor} stroke="none">
        {months.map((month, idx) => <text
          key={idx}
          x={idx * step + step}
          y={props.y}
          textAnchor="middle"
          dominantBaseline='central'
        >
          {month}
        </text>)}
      </g>
    );
  }
}

Labels.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array),
  xLeft: PropTypes.number.isRequired,
  xRight: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontColor: PropTypes.string.isRequired
};

Labels.defaultProps = {
  data: []
};

export default Labels;