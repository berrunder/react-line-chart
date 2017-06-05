import React from 'react'
import PropTypes from 'prop-types'

class Tooltip extends React.PureComponent {
  render() {
    const props = this.props;
    if (!props.show) {
      return null;
    }

    let diffSymbol = '';
    let diffColor = 'red';

    if (props.diffValue < 0) {
      diffSymbol = '▼';
    } else {
      diffColor = 'green';
      diffSymbol = '▲';
    }

    let frameX = props.x + props.offsetX;
    if (frameX + props.width > props.chartWidth) {
      frameX = props.x - props.offsetX - props.width;
    }

    let frameY = props.y - props.offsetY - props.height;
    if (frameY < 0) {
      frameY = props.y + props.offsetY;
    }

    return (
      <g>
        <defs>
          <filter id="shadow">
            <feGaussianBlur in="blurOut"
                            stdDeviation="2"/>
            <feOffset dx="1" dy="3"
                      result="offsetblur"/>
            <feFlood floodColor="#ccc"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <line
          x1={props.x}
          y1={props.y}
          x2={props.x}
          y2={props.chartHeight}
          stroke={props.plotColor}
          strokeDasharray="5, 5"
        />

        <circle
          cx={props.x}
          cy={props.y}
          r={4}
          stroke={props.backgroundColor}
          strokeWidth={2}
          fill={props.lineColor}
        />

        <rect
          x={frameX}
          y={frameY}
          height={props.height}
          width={props.width}
          rx={props.borderRadius}
          ry={props.borderRadius}
          fill="white"
          filter="url(#shadow)"
        />

        <text
          dominantBaseline='central'
          x={frameX + 5}
          y={frameY + props.height * 0.25}
          textAnchor="start"
          fontSize={props.fontSize}
          fill={props.fontColor}
          stroke="none"
        >
          {props.title}
        </text>

        <text
          dominantBaseline='central'
          x={frameX + 5}
          y={frameY + props.height * 0.6}
          textAnchor="start"
          fontSize={props.fontSize}
          fill="black"
          stroke="none"
        >
          $ {props.valueText}
        </text>

        {props.diffValue !== 0 && <text
          dominantBaseline='central'
          x={frameX + props.width / 2 + 5 }
          y={frameY + props.height * 0.6}
          textAnchor="start"
          fontSize={props.fontSize}
          stroke="none"
          fill={diffColor}
        >
          {diffSymbol}
          {Math.abs(props.diffValue).toFixed(2)}
        </text>}
      </g>
    );
  }
}

Tooltip.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  chartWidth: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  offsetY: PropTypes.number,
  borderRadius: PropTypes.number,
  title: PropTypes.string,
  valueText: PropTypes.string.isRequired,
  diffValue: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  plotColor: PropTypes.string.isRequired,
  lineColor: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontColor: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
};

Tooltip.defaultProps = {
  borderRadius: 5,
  offsetY: 0,
  offsetX: 0,
  title: ''
}

export default Tooltip;