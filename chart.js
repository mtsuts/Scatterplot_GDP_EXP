function chart(data, params) {
  const container = d3.select(params.container);
  // Define Metrics
  const width = container.node().getBoundingClientRect().width;
  const height = container.node().getBoundingClientRect().height;
  const marginTop = 20;
  const marginLeft = 90;
  const marginBottom = 40;
  const marginRight = 30;
  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height - marginTop - marginBottom;

  // Create Scales and axis

  const xScale = d3
    .scaleLinear()
    .domain([50, d3.max(data, (d) => d.expectancy)])
    .range([0, chartWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.gdp))])
    .range([chartHeight, 0]);

  const xaxis = d3.axisBottom(xScale);
  const yaxis = d3.axisLeft(yScale).ticks(5).tickSize(-chartWidth);

  // svg append

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create g element, add axis and append it to svg element

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, ${marginTop})`);

  g.append("g").call(xaxis).attr("transform", `translate(0, ${chartHeight})`);

  g.append("g").call(yaxis).attr("tranform", `translate(${marginLeft})`);

  svg
    .append("text")
    .attr("class", "axis-labels")
    .attr("x", chartWidth / 2 + 30)
    .attr("y", height - 4)
    .text("Life Expectancy");

  svg
    .append("text")
    .attr("class", "axis-labels")
    .attr("x", -marginLeft / 2)
    .attr("y", chartHeight / 2)
    .text("GDP per capita $")
    .attr("transform", `rotate(-90, ${marginLeft / 2}, ${chartHeight / 2})`);

  const chartGroup = g.append("g").attr("class", "chart");

  // Create circles for scatter plot and append it to svg element

  // d3 enter, exit, join

  const rScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((d) => d.gdp))])
    .range([6, 12]);

  const countries = data.map((d) => d.country);

  const select = d3
    .select("select")
    .attr("class", "countries")
    .selectAll("option")
    .data(countries)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  function drawCircles(data) {
    const circle = chartGroup
      .selectAll("circle") // choose every circle in this g element
      .data(data, (d) => d.country) // choose data
      .join("circle") // add data to this g element
      .attr("r", (d) => rScale(d.gdp)) // adding radius to this circle
      .attr("cx", 0) // x coord for each circle
      .attr("cy", chartHeight) // y coord for each circle
      .attr("fill", "steelblue");

    // transition logika
    circle
      .transition() // transition
      .duration(2000)
      .attr("cx", (d) => xScale(d.expectancy))
      .attr("cy", (d) => yScale(d.gdp));

    circle.each(function (d) {
      tippy(this, {
        content: `<div class='popup'>
        <h3> ${d.country}</h3>
        GDP: ${d.gdp}$
        Life Exp: ${d.expectancy} 
        </div>`,
        arrow: false,
        allowHTML: true,
        maxWidth: 120,
      });
    });
  }

  drawCircles(data);

  const selects = d3.select(".countries");

  selects.on("change", function () {
    let found = [];
    const el = selects.node();
    if (el.value === "All") {
      found = data;
    } else {
      found = data.filter((d) => d.country === el.value);
    }
    drawCircles(found);
  });
}
