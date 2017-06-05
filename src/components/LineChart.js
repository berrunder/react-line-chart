import React from 'react'
import PropTypes from 'prop-types'
import Polyline from './Polyline'
import Labels from './Labels'
import LineBox from './LineBox'
import Tooltip from './Tooltip'
import {formatDate, memoizeLast} from '../utils'

const getMaxValue = memoizeLast(data => Math.max(...data.map(point => point[1])));

const scaleData = memoizeLast((data, chartWidth, chartHeight) => {
  const xPoints = data.map(point => point[0])
  const xMax = Math.max(...xPoints);
  const xMin = Math.min(...xPoints);
  const xDiff = xMax - xMin;

  const scaleX = xDiff === 0 ? 1 : chartWidth / xDiff;

  const topY = Math.floor((getMaxValue(data) + 10) / 10) * 10;
  const scaleY = topY === 0 ? 1 : chartHeight / topY;

  return data.map(point => ([(point[0] - xMin) * scaleX, chartHeight - point[1] * scaleY]))
});


class LineChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: {
        show: false,
        x: 0,
        y: 0
      }
    }
  }

  handleMouseEnter = () => {
    this.setState({
      tooltip: {
        ...this.state.tooltip,
        show: true
      }
    })
  }

  handleMouseLeave = () => {
    this.setState({
      tooltip: {
        ...this.state.tooltip,
        show: false
      }
    })
  }

  handleMouseMove = evt => {
    const pt = this.svgPoint;
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const svgCoords = pt.matrixTransform(evt.target.getScreenCTM().inverse());
    this.setState({
      tooltip: {
        ...this.state.tooltip,
        x: svgCoords.x,
        y: svgCoords.y
      }
    })
  }

  captureRef = svg => {
    if (svg && svg.createSVGPoint) {
      this.svgPoint = svg.createSVGPoint();
    }
  }

  render() {
    const {height, width, offsetLeft, offsetTop, offsetRight, offsetBottom, data, ...props} = this.props;
    const svgStyle = {backgroundColor: props.backgroundColor, cursor: 'pointer'}

    const chartHeight = height - offsetBottom - offsetTop;
    const chartWidth = width - offsetRight - offsetLeft;
    const maxValue = Math.floor((getMaxValue(data) + 10) / 10) * 10;

    const scaledData = scaleData(data, chartWidth, chartHeight);

    const {x: tooltipX, y: tooltipY, tooltipIndex} = scaledData.reduce((acc, point, idx) => {
      const distance = Math.abs(point[0] - this.state.tooltip.x + offsetLeft)
      if (distance < acc.distance) {
        return {
          distance,
          x: point[0] + offsetLeft,
          y: point[1] + offsetTop,
          tooltipIndex: idx
        }
      }

      return acc;
    }, {distance: width, x: this.state.tooltip.x, y: this.state.tooltip.y, tooltipIndex: -1})

    const tooltipPoint = data[tooltipIndex];
    const tooltipTitle = formatDate(new Date(tooltipPoint[0]));
    const tooltipValue = tooltipPoint[1].toFixed(2);
    const tooltipDiff = tooltipIndex > 0 ? tooltipPoint[1] - data[tooltipIndex - 1][1] : 0;

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={svgStyle}
        ref={this.captureRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      >

        <LineBox
          x={offsetLeft}
          y={offsetTop}
          height={chartHeight}
          width={chartWidth}
          lineCount={props.yLabelsCount}
          maxValue={maxValue}
          stroke={props.plotColor}
          fontSize={props.fontSize}
          fontColor={props.fontColor}
        />

        <Labels
          data={data}
          fontSize={props.fontSize}
          fontColor={props.fontColor}
          xLeft={offsetLeft}
          xRight={width - offsetRight}
          y={height - offsetBottom * 0.75}
        />

        <text x={offsetLeft}
              y={height - props.fontSize}
              fontSize={props.fontSize}
              fill={props.fontColor}
              stroke="none"
              textAnchor="start"
        >
          {props.title}
        </text>

        <Polyline
          data={scaledData}
          offsetX={offsetLeft}
          offsetY={offsetTop}
          stroke={props.lineColor}
        />

        <Tooltip
          show={this.state.tooltip.show}
          width={props.tooltipWidth}
          height={props.tooltipHeight}
          offsetY={props.tooltipOffsetY}
          offsetX={props.tooltipOffsetX}
          backgroundColor={props.backgroundColor}
          lineColor={props.lineColor}
          plotColor={props.heightLineColor}
          x={tooltipX}
          y={tooltipY}
          title={tooltipTitle}
          valueText={tooltipValue}
          diffValue={tooltipDiff}
          fontSize={props.fontSize}
          fontColor={props.fontColor}
          chartHeight={chartHeight + offsetTop}
          chartWidth={chartWidth + offsetLeft}
        />
      </svg>
    )
  }
}

LineChart.propTypes = {
  title: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  offsetLeft: PropTypes.number,
  offsetRight: PropTypes.number,
  offsetTop: PropTypes.number,
  offsetBottom: PropTypes.number,
  yLabelsCount: PropTypes.number,
  tooltipHeight: PropTypes.number,
  tooltipWidth: PropTypes.number,
  tooltipOffsetX: PropTypes.number,
  tooltipOffsetY: PropTypes.number,
  backgroundColor: PropTypes.string,
  plotColor: PropTypes.string,
  lineColor: PropTypes.string,
  heightLineColor: PropTypes.string,
  fontSize: PropTypes.number,
  fontColor: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.array)
};

LineChart.defaultProps = {
  width: 850,
  height: 320,
  yLabelsCount: 5,
  offsetRight: 10,
  offsetLeft: 40,
  offsetTop: 20,
  offsetBottom: 50,
  tooltipHeight: 50,
  tooltipWidth: 120,
  tooltipOffsetX: 5,
  tooltipOffsetY: 15,
  backgroundColor: '#f6f7f8',
  plotColor: '#e9eaec',
  lineColor: '#74a3c7',
  heightLineColor: '#dbddde',
  fontSize: 12,
  fontColor: '#b0b5bb',
  data: []
};

export default LineChart;
