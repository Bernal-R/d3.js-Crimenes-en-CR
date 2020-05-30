import {
  axisLeft,
  axisBottom,
  scaleLinear,
  extent,
  scaleTime,
  line,
  curveBasis,
  timeFormat,
  nest
} from 'd3'; 

export const lineChart = (selection, props) => {
  
  const {
    data,
    colorScale,
    width,
    height,
    margin,
    title,
    xValue,
    xAxisLabel,
    yValue,
    yAxisLabel,
    colorValue,
    innerWidth,
    innerHeight,
  } = props;
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container');
  gEnter
    .merge(g)
      .attr('transform',
        `translate(${margin.left},${margin.top})`
      )
  
  gEnter.append('text')
    .merge(g.select('.title'))
      .attr('class', 'title')
      .attr('y', -10)
      .text(title);
  
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
  
  const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15)
    .tickFormat(timeFormat('%b'));
  
  const yAxis = axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
  
  
  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class', 'y-axis');
  
  yAxisG.merge(yAxisGEnter)
      .call(yAxis)
    .selectAll('.domain').remove();

  yAxisGEnter.append('text')
    .attr('class', 'axis-label')
    .attr('y', -73)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
  .merge(yAxisG.select('.axis-label'))
    .attr('x', -innerHeight / 2)
    .text(yAxisLabel);
  
    
  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class', 'x-axis');
  
  xAxisG
    .merge(xAxisGEnter)
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('domain').remove();
  
  xAxisGEnter.append('text')
    .attr('class', 'axis-label')
    .attr('y', 75)
    .attr('fill', 'black')
  .merge(xAxisG.select('.axis-label'))
    .attr('x', innerWidth / 2)
    .text(xAxisLabel);

  const lineGenerator = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)))
    .curve(curveBasis);

  const nested = nest()
    .key(colorValue)
    .entries(data);
  
  
  const dataline = gEnter.merge(g)
    .selectAll('.dataline').data(nested);
  dataline
    .enter().append('path')
      .attr('class', 'dataline')
    .merge(dataline)
      .transition().duration(1500)
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => colorScale(d.key));
  
  
 
  
  
}