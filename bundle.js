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
        	d.Desconocido = +d.Desconocido;
        	d.ISLAS = +d.ISLAS;
        	d.REPUBLICA = +d.REPUBLICA;
        	d.REPUBLICADEL = +d.REPUBLICADEL;
        	d.REPUBLICADEMOCRATICADEL = +d.REPUBLICADEMOCRATICADEL;
        	d.ALAJUELA = +d.ALAJUELA;
        	d.CARTAGO = +d.CARTAGO;
        	d.GUANACASTE = +d.GUANACASTE;
        	d.HEREDIA = +d.HEREDIA;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImRyb3Bkb3duTWVudS5qcyIsImxvYWRBbmRQcm9jZXNzRGF0YS5qcyIsImNvbG9yTGVnZW5kLmpzIiwibGluZUNoYXJ0LmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY29uc3QgZHJvcGRvd25NZW51ID0gKHNlbGVjdGlvbiwgcHJvcHMpID0+IHtcblx0Y29uc3Qge1xuICAgICAgb3B0aW9ucyxcbiAgICAgIG9uT3B0aW9uQ2xpY2tlZCxcbiAgICAgIHNlbGVjdGVkT3B0aW9uXG4gICAgfSA9IHByb3BzO1xuICBcbiAgbGV0IHNlbGVjdCA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoJ3NlbGVjdCcpLmRhdGEoW251bGxdKTtcbiAgc2VsZWN0ID0gc2VsZWN0LmVudGVyKCkuYXBwZW5kKCdzZWxlY3QnKVxuICAgIC5tZXJnZShzZWxlY3QpXG4gICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBvbk9wdGlvbkNsaWNrZWQodGhpcy52YWx1ZSk7XG4gICAgICB9KTtcbiAgXG4gIGNvbnN0IG9wdGlvbiA9IHNlbGVjdC5zZWxlY3RBbGwoJ29wdGlvbicpLmRhdGEob3B0aW9ucyk7XG4gIG9wdGlvbi5lbnRlcigpLmFwcGVuZCgnb3B0aW9uJylcbiAgICAubWVyZ2Uob3B0aW9uKVxuICAgICAgLmF0dHIoJ3ZhbHVlJywgZCA9PiBkKVxuICAgICAgLnByb3BlcnR5KCdzZWxlY3RlZCcsIGQgPT4gZCA9PT0gc2VsZWN0ZWRPcHRpb24pXG4gICAgICAudGV4dChkID0+IGQpO1xufTsiLCIvLyBsb2FkIGluIGFuZCBwcm9jZXNzIGRhdGEgXG5pbXBvcnQge1xuICBjc3YsXG4gIHJhbmdlXG59IGZyb20gJ2QzJztcblxuXG5leHBvcnQgY29uc3QgbG9hZEFuZFByb2Nlc3NEYXRhID0gKCkgPT4gXG5cbmNzdignZGF0YS5jc3YnKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgICBkLmRhdGUgPSBuZXcgRGF0ZShkLkRhdGUpO1xuICAgICAgZC55ZWFyID0gK2QuWWVhcjtcbiAgICAgIGQueWVhciA9ICtkLlllYXI7XG4gICAgICBcdGQuRGVzY29ub2NpZG8gPSArZC5EZXNjb25vY2lkbztcbiAgICAgIFx0ZC5JU0xBUyA9ICtkLklTTEFTO1xuICAgICAgXHRkLlJFUFVCTElDQSA9ICtkLlJFUFVCTElDQTtcbiAgICAgIFx0ZC5SRVBVQkxJQ0FERUwgPSArZC5SRVBVQkxJQ0FERUw7XG4gICAgICBcdGQuUkVQVUJMSUNBREVNT0NSQVRJQ0FERUwgPSArZC5SRVBVQkxJQ0FERU1PQ1JBVElDQURFTDtcbiAgICAgIFx0ZC5BTEFKVUVMQSA9ICtkLkFMQUpVRUxBO1xuICAgICAgXHRkLkNBUlRBR08gPSArZC5DQVJUQUdPO1xuICAgICAgXHRkLkdVQU5BQ0FTVEUgPSArZC5HVUFOQUNBU1RFO1xuICAgICAgXHRkLkhFUkVESUEgPSArZC5IRVJFRElBO1xuICAgICAgXHRkLkxJTU9OID0gK2QuTElNT047XG4gICAgICBcdGQuUFVOVEFSRU5BUyA9ICtkLlBVTlRBUkVOQVM7XG4gICAgICBcdGQuU0FOSk9TRSA9ICtkLlNBTkpPU0U7XG4gICAgICBkLkJhcm5hcmRDb2xsZWdlID0gK2QuQmFybmFyZENvbGxlZ2U7XG4gICAgICBcdGQuQnVzaW5lc3NTY2hvb2wgPSArZC5CdXNpbmVzc1NjaG9vbDtcbiAgICAgIFx0ZC5EZW50YWxNZWRpY2luZSA9ICtkLkRlbnRhbE1lZGljaW5lO1xuICAgICAgXHRkLlBoeXNpY2lhbnNTdXJnZW9ucyA9ICtkLlBoeXNpY2lhbnNTdXJnZW9ucztcbiAgICAgIFx0ZC5Db2x1bWJpYUNvbGxlZ2UgPSArZC5Db2x1bWJpYUNvbGxlZ2U7XG4gICAgICBcdGQuR1NBUFAgPSArZC5HU0FQUDtcbiAgICAgICAgZC5HU0FTID0gK2QuR1NBUztcblx0XHRcdFx0ZC5HU0VBUyA9ICtkLkdTRUFTO1xuXHRcdFx0XHRkLkxhd1NjaG9vbCA9ICtkLkxhd1NjaG9vbDtcblx0XHRcdFx0ZC5TRUFTID0gK2QuU0VBUztcblx0XHRcdFx0ZC5HZW5lcmFsU3R1ZGllcyA9ICtkLkdlbmVyYWxTdHVkaWVzO1xuXHRcdFx0XHRkLlNJUEEgPSArZC5TSVBBO1xuXHRcdFx0XHRkLkpvdXJuYWxpc20gPSArZC5Kb3VybmFsaXNtO1xuXHRcdFx0XHRkLk51cnNpbmcgPSArZC5OdXJzaW5nO1xuXHRcdFx0XHRkLlNQUyA9ICtkLlNQUztcblx0XHRcdFx0ZC5QdWJsaWNIZWFsdGggPSArZC5QdWJsaWNIZWFsdGg7XG5cdFx0XHRcdGQuU29jaWFsV29yayA9ICtkLlNvY2lhbFdvcms7XG5cdFx0XHRcdGQuQXJ0cyA9ICtkLkFydHM7XG5cdFx0XHRcdGQuVGVhY2hlcnNDb2xsZWdlID0gK2QuVGVhY2hlcnNDb2xsZWdlO1xuXHRcdFx0XHRkLlVUUyA9ICtkLlVUUztcbiAgICAgIH0pO1xuICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBcbiAgICByZXR1cm4gZGF0YTtcbiAgfSk7XG4gICBcbiIsImV4cG9ydCBjb25zdCBjb2xvckxlZ2VuZCA9IChzZWxlY3Rpb24sIHByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjb2xvclNjYWxlLFxuICAgIGNpcmNsZVJhZGl1cyxcbiAgICBzcGFjaW5nLFxuICAgIHRleHRPZmZzZXRcbiAgfSA9IHByb3BzO1xuXG4gIGNvbnN0IGdyb3VwcyA9IHNlbGVjdGlvbi5zZWxlY3RBbGwoJ2cnKVxuICAgIC5kYXRhKGNvbG9yU2NhbGUuZG9tYWluKCkpO1xuICBjb25zdCBncm91cHNFbnRlciA9IGdyb3Vwc1xuICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnbGVnZW5kJyk7XG4gIGdyb3Vwc0VudGVyXG4gICAgLm1lcmdlKGdyb3VwcylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT5cbiAgICAgICAgYHRyYW5zbGF0ZSgwLCAke2kgKiBzcGFjaW5nfSlgXG4gICAgICApO1xuICBncm91cHMuZXhpdCgpLnJlbW92ZSgpO1xuXG4gIGdyb3Vwc0VudGVyLmFwcGVuZCgnY2lyY2xlJylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgnY2lyY2xlJykpXG4gICAgICAuYXR0cigncicsIGNpcmNsZVJhZGl1cylcbiAgICAgIC5hdHRyKCdmaWxsJywgY29sb3JTY2FsZSk7XG5cbiAgZ3JvdXBzRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZ3JvdXBzLnNlbGVjdCgndGV4dCcpKVxuICAgICAgLnRleHQoZCA9PiBkKVxuICAgICAgLmF0dHIoJ2R5JywgJzAuMzJlbScpXG4gICAgICAuYXR0cigneCcsIHRleHRPZmZzZXQpO1xufSIsImltcG9ydCB7XG4gIGF4aXNMZWZ0LFxuICBheGlzQm90dG9tLFxuICBzY2FsZUxpbmVhcixcbiAgZXh0ZW50LFxuICBzY2FsZVRpbWUsXG4gIGxpbmUsXG4gIGN1cnZlQmFzaXMsXG4gIHRpbWVGb3JtYXQsXG4gIG5lc3Rcbn0gZnJvbSAnZDMnOyBcblxuZXhwb3J0IGNvbnN0IGxpbmVDaGFydCA9IChzZWxlY3Rpb24sIHByb3BzKSA9PiB7XG4gIFxuICBjb25zdCB7XG4gICAgZGF0YSxcbiAgICBjb2xvclNjYWxlLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBtYXJnaW4sXG4gICAgdGl0bGUsXG4gICAgeFZhbHVlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeVZhbHVlLFxuICAgIHlBeGlzTGFiZWwsXG4gICAgY29sb3JWYWx1ZSxcbiAgICBpbm5lcldpZHRoLFxuICAgIGlubmVySGVpZ2h0LFxuICB9ID0gcHJvcHM7XG4gIFxuICBjb25zdCBnID0gc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmNvbnRhaW5lcicpLmRhdGEoW251bGxdKTtcbiAgY29uc3QgZ0VudGVyID0gZ1xuICAgIC5lbnRlcigpLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnY29udGFpbmVyJyk7XG4gIGdFbnRlclxuICAgIC5tZXJnZShnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsXG4gICAgICAgIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sJHttYXJnaW4udG9wfSlgXG4gICAgICApXG4gIFxuICBnRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAubWVyZ2UoZy5zZWxlY3QoJy50aXRsZScpKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlJylcbiAgICAgIC5hdHRyKCd5JywgLTEwKVxuICAgICAgLnRleHQodGl0bGUpO1xuICBcbiAgY29uc3QgeFNjYWxlID0gc2NhbGVUaW1lKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB4VmFsdWUpKVxuICAgIC5yYW5nZShbMCwgaW5uZXJXaWR0aF0pXG4gICAgLm5pY2UoKTtcbiAgXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB5VmFsdWUpKVxuICAgIC5yYW5nZShbaW5uZXJIZWlnaHQsIDBdKVxuICAgIC5uaWNlKCk7XG4gIFxuICBjb25zdCB4QXhpcyA9IGF4aXNCb3R0b20oeFNjYWxlKVxuICAgIC50aWNrU2l6ZSgtaW5uZXJIZWlnaHQpXG4gICAgLnRpY2tQYWRkaW5nKDE1KVxuICAgIC50aWNrRm9ybWF0KHRpbWVGb3JtYXQoJyViJykpO1xuICBcbiAgY29uc3QgeUF4aXMgPSBheGlzTGVmdCh5U2NhbGUpXG4gICAgLnRpY2tTaXplKC1pbm5lcldpZHRoKVxuICAgIC50aWNrUGFkZGluZygxMCk7XG4gIFxuICBcbiAgY29uc3QgeUF4aXNHID0gZy5zZWxlY3QoJy55LWF4aXMnKTtcbiAgY29uc3QgeUF4aXNHRW50ZXIgPSBnRW50ZXJcbiAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd5LWF4aXMnKTtcbiAgXG4gIHlBeGlzRy5tZXJnZSh5QXhpc0dFbnRlcilcbiAgICAgIC5jYWxsKHlBeGlzKVxuICAgIC5zZWxlY3RBbGwoJy5kb21haW4nKS5yZW1vdmUoKTtcblxuICB5QXhpc0dFbnRlci5hcHBlbmQoJ3RleHQnKVxuICAgIC5hdHRyKCdjbGFzcycsICdheGlzLWxhYmVsJylcbiAgICAuYXR0cigneScsIC03MylcbiAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsIGByb3RhdGUoLTkwKWApXG4gICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gIC5tZXJnZSh5QXhpc0cuc2VsZWN0KCcuYXhpcy1sYWJlbCcpKVxuICAgIC5hdHRyKCd4JywgLWlubmVySGVpZ2h0IC8gMilcbiAgICAudGV4dCh5QXhpc0xhYmVsKTtcbiAgXG4gICAgXG4gIGNvbnN0IHhBeGlzRyA9IGcuc2VsZWN0KCcueC1heGlzJyk7XG4gIGNvbnN0IHhBeGlzR0VudGVyID0gZ0VudGVyXG4gICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAneC1heGlzJyk7XG4gIFxuICB4QXhpc0dcbiAgICAubWVyZ2UoeEF4aXNHRW50ZXIpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aW5uZXJIZWlnaHR9KWApXG4gICAgICAuY2FsbCh4QXhpcylcbiAgICAgIC5zZWxlY3RBbGwoJ2RvbWFpbicpLnJlbW92ZSgpO1xuICBcbiAgeEF4aXNHRW50ZXIuYXBwZW5kKCd0ZXh0JylcbiAgICAuYXR0cignY2xhc3MnLCAnYXhpcy1sYWJlbCcpXG4gICAgLmF0dHIoJ3knLCA3NSlcbiAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gIC5tZXJnZSh4QXhpc0cuc2VsZWN0KCcuYXhpcy1sYWJlbCcpKVxuICAgIC5hdHRyKCd4JywgaW5uZXJXaWR0aCAvIDIpXG4gICAgLnRleHQoeEF4aXNMYWJlbCk7XG5cbiAgY29uc3QgbGluZUdlbmVyYXRvciA9IGxpbmUoKVxuICAgIC54KGQgPT4geFNjYWxlKHhWYWx1ZShkKSkpXG4gICAgLnkoZCA9PiB5U2NhbGUoeVZhbHVlKGQpKSlcbiAgICAuY3VydmUoY3VydmVCYXNpcyk7XG5cbiAgY29uc3QgbmVzdGVkID0gbmVzdCgpXG4gICAgLmtleShjb2xvclZhbHVlKVxuICAgIC5lbnRyaWVzKGRhdGEpO1xuICBcbiAgXG4gIGNvbnN0IGRhdGFsaW5lID0gZ0VudGVyLm1lcmdlKGcpXG4gICAgLnNlbGVjdEFsbCgnLmRhdGFsaW5lJykuZGF0YShuZXN0ZWQpO1xuICBkYXRhbGluZVxuICAgIC5lbnRlcigpLmFwcGVuZCgncGF0aCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZGF0YWxpbmUnKVxuICAgIC5tZXJnZShkYXRhbGluZSlcbiAgICAgIC50cmFuc2l0aW9uKCkuZHVyYXRpb24oMTUwMClcbiAgICAgIC5hdHRyKCdkJywgZCA9PiBsaW5lR2VuZXJhdG9yKGQudmFsdWVzKSlcbiAgICAgIC5hdHRyKCdzdHJva2UnLCBkID0+IGNvbG9yU2NhbGUoZC5rZXkpKTtcbiAgXG4gIFxuIFxuICBcbiAgXG59IiwiaW1wb3J0IHtcbiAgc2VsZWN0LFxuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVPcmRpbmFsLFxuICBleHRlbnQsXG4gIGF4aXNCb3R0b20sXG4gIGF4aXNMZWZ0LFxuICBjc3YsXG59IGZyb20gJ2QzJztcblxuXG5pbXBvcnQgeyBkcm9wZG93bk1lbnUgfSBmcm9tICcuL2Ryb3Bkb3duTWVudS5qcyc7XG5pbXBvcnQgeyBsb2FkQW5kUHJvY2Vzc0RhdGEgfSBmcm9tICcuL2xvYWRBbmRQcm9jZXNzRGF0YSc7XG5pbXBvcnQgeyBjb2xvckxlZ2VuZCB9IGZyb20gJy4vY29sb3JMZWdlbmQnO1xuaW1wb3J0IHsgbGluZUNoYXJ0IH0gZnJvbSAnLi9saW5lQ2hhcnQnO1xuXG5cbmNvbnN0IHN2ZyA9IHNlbGVjdCgnc3ZnJyk7XG5jb25zdCB3aWR0aCA9ICtzdmcuYXR0cignd2lkdGgnKTtcbmNvbnN0IGhlaWdodCA9ICtzdmcuYXR0cignaGVpZ2h0Jyk7XG5cbmNvbnN0IGxpbmVDaGFydEcgPSBzdmcuYXBwZW5kKCdnJyk7XG5jb25zdCBjb2xvckxlZ2VuZEcgPSBzdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJyxgdHJhbnNsYXRlKDg1NCw4MClgKTtcblxuXG5jb25zdCBjb2xvclNjYWxlID0gc2NhbGVPcmRpbmFsKClcbiAgLmRvbWFpbihbJzIwMTYnLCAnMjAxNycsICcyMDE4JywgJzIwMTknXSlcbiAgLnJhbmdlKFtcbiAgICAnI2U3NjA3MycsXG4gICAgJyMxY2VlOWEnLFxuICAgICcjMDFkMDEyJyxcbiAgICAnI2VlNTRjNCdcbiAgXSk7XG5cblxuY29uc3QgdGl0bGUgPSAnRGVsaXRvcyBwb3IgcHJvdmluY2lhIGVudHJlIDIwMTYgeSAyMDE5JztcblxuY29uc3QgY2lyY2xlUmFkaXVzID0gMTA7XG4gIFxuY29uc3QgbWFyZ2luID0geyB0b3A6IDYwLCByaWdodDogMTMwLCBib3R0b206IDg4LCBsZWZ0OiAxNTAgfTtcbmNvbnN0IGlubmVyV2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0IC0gODtcbmNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbmxldCBkYXRhO1xubGV0IHNlbGVjdGVkQ29sb3JWYWx1ZTtcbmxldCB4Q29sdW1uO1xubGV0IHlDb2x1bW47XG5cblxuY29uc3Qgb25DbGljayA9IGQgPT4ge1xuICBzZWxlY3RlZENvbG9yVmFsdWUgPSBkO1xuICByZW5kZXIoKTtcbn1cblxubG9hZEFuZFByb2Nlc3NEYXRhKClcbiAgLnRoZW4oZCA9PiB7XG4gICAgZGF0YSA9IGQ7XG4gICAgeENvbHVtbiA9IGQuRGF0ZTtcbiAgICB5Q29sdW1uID0gZC5jb2x1bW5zWzZdO1xuICAgIHJlbmRlcigpO1xufSk7XG5cbmNvbnN0IG9uWENvbHVtbkNsaWNrZWQgPSBjb2x1bW4gPT4ge1xuICB4Q29sdW1uID0gY29sdW1uO1xuICByZW5kZXIoKTtcbn07XG5cbmNvbnN0IG9uWUNvbHVtbkNsaWNrZWQgPSBjb2x1bW4gPT4ge1xuICB5Q29sdW1uID0gY29sdW1uO1xuICByZW5kZXIoKTtcbn07XG5cbmNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgc2VsZWN0KCcjeS1tZW51JylcbiAgICAuY2FsbChkcm9wZG93bk1lbnUsIHtcbiAgICAgIG9wdGlvbnM6IGRhdGEuY29sdW1ucy5maWx0ZXIoY29sdW1uID0+XG4gICAgICAgIGNvbHVtbiAhPT0gJ2RhdGUnICYmXG4gICAgICAgIGNvbHVtbiAhPT0gJ3llYXInICYmXG4gICAgICAgIGNvbHVtbiAhPT0gJ0RhdGUnICYmXG4gICAgICAgIGNvbHVtbiAhPT0gJ1llYXInXG4gICAgICApLFxuICAgICAgb25PcHRpb25DbGlja2VkOiBvbllDb2x1bW5DbGlja2VkLFxuICAgICAgc2VsZWN0ZWRPcHRpb246IHlDb2x1bW5cbiAgICB9KTtcbiAgXG5cblxuICAgIGxpbmVDaGFydEcuY2FsbChsaW5lQ2hhcnQse1xuICAgICAgZGF0YSxcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIG1hcmdpbixcbiAgICAgIHRpdGxlOiAnUHJvdmluY2lhOiAnKyB5Q29sdW1uLFxuICAgICAgeFZhbHVlOiBkID0+IGQuZGF0ZSxcbiAgICAgIHhBeGlzTGFiZWw6ICdNb250aCcsXG4gICAgICB5VmFsdWU6IGQgPT4gZFt5Q29sdW1uXSxcbiAgICAgIGNvbG9yVmFsdWU6IGQgPT4gZC55ZWFyLFxuICAgICAgeUF4aXNMYWJlbDogeUNvbHVtbiwgXG4gICAgICBpbm5lcldpZHRoLFxuICAgICAgaW5uZXJIZWlnaHRcbiAgICB9KTtcblxuICBjb2xvckxlZ2VuZEcuY2FsbChjb2xvckxlZ2VuZCx7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY2lyY2xlUmFkaXVzOiAxMCxcbiAgICAgIHNwYWNpbmc6IDI1LFxuICAgICAgdGV4dE9mZnNldDogMjBcbiAgfSk7XG59OyJdLCJuYW1lcyI6WyJjc3YiLCJzY2FsZVRpbWUiLCJleHRlbnQiLCJzY2FsZUxpbmVhciIsImF4aXNCb3R0b20iLCJ0aW1lRm9ybWF0IiwiYXhpc0xlZnQiLCJsaW5lIiwiY3VydmVCYXNpcyIsIm5lc3QiLCJzZWxlY3QiLCJzY2FsZU9yZGluYWwiXSwibWFwcGluZ3MiOiI7OztFQUNPLE1BQU0sWUFBWSxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssS0FBSztFQUNsRCxDQUFDLE1BQU07RUFDUCxNQUFNLE9BQU87RUFDYixNQUFNLGVBQWU7RUFDckIsTUFBTSxjQUFjO0VBQ3BCLEtBQUssR0FBRyxLQUFLLENBQUM7RUFDZDtFQUNBLEVBQUUsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQzFELEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO0VBQzFDLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztFQUNsQixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsV0FBVztFQUMvQixRQUFRLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDcEMsT0FBTyxDQUFDLENBQUM7RUFDVDtFQUNBLEVBQUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDMUQsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUNqQyxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7RUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDNUIsT0FBTyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssY0FBYyxDQUFDO0VBQ3RELE9BQU8sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNwQixDQUFDOztFQ3JCRDtBQUNBLEFBSUE7QUFDQTtBQUNBLEVBQU8sTUFBTSxrQkFB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