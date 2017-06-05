import React from 'react'
import PropTypes from 'prop-types'

class Polyline extends React.PureComponent {
  render() {
    const props = this.props;
    const points = props.data
      .map(pair => `${pair[0] + props.offsetX} ${pair[1] + props.offsetY}`)
      .join(', ');

    return <polyline
      stroke={props.stroke}
      strokeLinejoin="round"
      strokeWidth="2"
      fill="none"
      points={points}
    />;
  }
}

Polyline.propTypes = {
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  stroke: PropTypes.string.isRequired
};

Polyline.defaultProps = {
  offsetX: 0,
  offsetY: 0,
  data: []
}

export default Polyline;