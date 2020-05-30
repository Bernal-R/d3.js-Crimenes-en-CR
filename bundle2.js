(function (d3) {
  'use strict';

  const dropdownMenu = (selection, props) => {
  	const {
        options,
        onOptionClicked,
        selectedOption
      } = props;
    
    let select = selection.selectAll('select').data([null]);
    select = select.enter().append('select')
      .merge(select)
        .on('change', function() {
          onOptionClicked(this.value);
        });
    
    const option = select.selectAll('option').data(options);
    option.enter().append('option')
      .merge(option)
        .attr('value', d => d)
        .property('selected', d => d === selectedOption)
        .text(d => d);
  };

  // load in and process data 


  const loadAndProcessData = () => 

  d3.csv('data.csv')
    .then(data => {
      data.forEach(d => {
        d.date = new Date(d.Date);
        d.year = +d.Year;
        d.year = +d.Year;
        d.ALAJUELA = +d.ALAJUELA;
        	d.CARTAGO = +d.CARTAGO;
        	d.GUANACASTE = +d.GUANACASTE;
        	d.HEREDIA = +d.HEREDIAS;
        	d.LIMON = +d.LIMON;
        	d.PUNTARENAS = +d.PUNTARENAS;
        	d.SANJOSE = +d.SANJOSE;
        d.BarnardCollege = +d.BarnardCollege;
        	d.BusinessSchool = +d.BusinessSchool;
        	d.DentalMedicine = +d.DentalMedicine;
        	d.PhysiciansSurgeons = +d.PhysiciansSurgeons;
        	d.ColumbiaCollege = +d.ColumbiaCollege;
        	d.GSAPP = +d.GSAPP;
          d.GSAS = +d.GSAS;
  				d.GSEAS = +d.GSEAS;
  				d.LawSchool = +d.LawSchool;
  				d.SEAS = +d.SEAS;
  				d.GeneralStudies = +d.GeneralStudies;
  				d.SIPA = +d.SIPA;
  				d.Journalism = +d.Journalism;
  				d.Nursing = +d.Nursing;
  				d.SPS = +d.SPS;
  				d.PublicHealth = +d.PublicHealth;
  				d.SocialWork = +d.SocialWork;
  				d.Arts = +d.Arts;
  				d.TeachersCollege = +d.TeachersCollege;
  				d.UTS = +d.UTS;
        });
    // console.log(data);
      
      return data;
    });

  const colorLegend = (selection, props) => {
    const {
      colorScale,
      circleRadius,
      spacing,
      textOffset
    } = props;

    const groups = selection.selectAll('g')
      .data(colorScale.domain());
    const groupsEnter = groups
      .enter().append('g')
        .attr('class', 'legend');
    groupsEnter
      .merge(groups)
        .attr('transform', (d, i) =>
          `translate(0, ${i * spacing})`
        );
    groups.exit().remove();

    groupsEnter.append('circle')
      .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale);

    groupsEnter.append('text')
      .merge(groups.select('text'))
        .text(d => d)
        .attr('dy', '0.32em')
        .attr('x', textOffset);
  };

  const lineChart = (selection, props) => {
    
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
    
    //console.log(title);
    

    
    const g = selection.selectAll('.container').data([null]);
    const gEnter = g
      .enter().append('g')
        .attr('class', 'container');
    gEnter
      .merge(g)
        .attr('transform',
          `translate(${margin.left},${margin.top})`
        );
    
    gEnter.append('text')
      .merge(g.select('.title'))
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15)
      .tickFormat(d3.timeFormat('%b'));
    
    const yAxis = d3.axisLeft(yScale)
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
    
    
  /*   //make line to show limit #fc9f9c #9bc9ef
    gEnter.append("line")          
      .style("stroke", "#9bc9ef")
      .style("stroke-width", 3.2)
      .attr("x1", 674)
      .attr("y1", yScale(10))
      .attr("x2", 674)
      .attr("y2", yScale(10)); 
    
    
    gEnter.append('text')
        //.attr('class', 'axis-label')
        .attr('y', yScale(10)+15)
        .attr('x', innerWidth / 2 - 330)
        .attr('fill', '#9bc9ef')
        .text("World Health Org. Limit");*/
    

  //////////////////line stuff

    const lineGenerator = d3.line()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveBasis);

    const nested = d3.nest()
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
    
  //   .dataline2 {
  //   fill: none;
  //   stroke: #fde0dd;
  //   opacity: 0.6;
  //   stroke-width: 5;
  //   stroke-linejoin: round;
  // }
    
    
   
    
    
  };

  const svg = d3.select('svg');
  const width = +svg.attr('width');
  const height = +svg.attr('height');

  const lineChartG = svg.append('g');
  const colorLegendG = svg.append('g')
      .attr('transform',`translate(854,80)`);


  const colorScale = d3.scaleOrdinal()
    .domain(['2016', '2017', '2018', '2019'])
    .range([
      '#e76073',
      '#1cee9a',
      '#01d012',
      '#ee54c4'
    ]);
    
  const margin = { top: 60, right: 130, bottom: 88, left: 150 };
  const innerWidth = width - margin.left - margin.right - 8;
  const innerHeight = height - margin.top - margin.bottom;

  let data;
  let xColumn;
  let yColumn;

  loadAndProcessData()
    .then(d => {
      data = d;
      xColumn = d.Date;
      yColumn = d.columns[6];
      render();
  });

  const onYColumnClicked = column => {
    yColumn = column;
    render();
  };

  const render = () => {
    d3.select('#y-menu')
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

}(d3));