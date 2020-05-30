import {
  select,
  scaleLinear,
  scaleOrdinal,
  extent,
  axisBottom,
  axisLeft,
  csv,
} from 'd3';


import { dropdownMenu } from './dropdownMenu.js';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';
import { lineChart } from './lineChart';


const svg = select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const lineChartG = svg.append('g');
const colorLegendG = svg.append('g')
    .attr('transform',`translate(854,80)`);


const colorScale = scaleOrdinal()
  .domain(['2016', '2017', '2018', '2019'])
  .range([
    '#e76073',
    '#1cee9a',
    '#01d012',
    '#ee54c4'
  ]);


const title = 'Delitos por provincia entre 2016 y 2019';

const circleRadius = 10;
  
const margin = { top: 60, right: 130, bottom: 88, left: 150 };
const innerWidth = width - margin.left - margin.right - 8;
const innerHeight = height - margin.top - margin.bottom;

let data;
let selectedColorValue;
let xColumn;
let yColumn;


const onClick = d => {
  selectedColorValue = d;
  render();
}

loadAndProcessData()
  .then(d => {
    data = d;
    xColumn = d.Date;
    yColumn = d.columns[6];
    render();
});

const onXColumnClicked = column => {
  xColumn = column;
  render();
};

const onYColumnClicked = column => {
  yColumn = column;
  render();
};

const render = () => {
  select('#y-menu')
    .call(dropdownMenu, {
      options: data.columns.filter(column =>
        column !== 'date' &&
        column !== 'year' &&
        column !== 'Date' &&
        column !== 'Year'
      ),
      onOptionClicked: onYColumnClicked,
      selectedOption: yColumn
    });
  


    lineChartG.call(lineChart,{
      data,
      colorScale,
      width,
      height,
      margin,
      title: 'Provincia: '+ yColumn,
      xValue: d => d.date,
      xAxisLabel: 'Month',
      yValue: d => d[yColumn],
      colorValue: d => d.year,
      yAxisLabel: yColumn, 
      innerWidth,
      innerHeight
    });

  colorLegendG.call(colorLegend,{
      colorScale,
      circleRadius: 10,
      spacing: 25,
      textOffset: 20
  });
};