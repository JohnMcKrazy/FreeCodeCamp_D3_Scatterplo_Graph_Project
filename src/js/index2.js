document.addEventListener("DOMContentLoaded", () => {
    //^ CHART CONTAINER DECLARATION//
    const container = document.querySelector(".graph_container");

    //^ DIMENTIONS //
    const margin_top = 100;
    const margin_bottom = 30;
    const margin_right = 20;
    const margin_left = 60;

    const width = 920 - margin_left - margin_right;
    const height = 630 - margin_top - margin_bottom;

    // !! CAMBIAR ESCALA DE COLOR  !! //
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // !! CAMBIAR ESCALA DE COLOR  !! //

    //^ TOOLTIP CREATION//
    const tooltipItem = d3.select("body").append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

    //^ SVG CREATION//
    const graphContainer = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin_left + margin_right)
        .attr("height", height + margin_top + margin_bottom)
        .attr("class", "graph")
        .append("g")
        .attr("transform", "translate(" + margin_left + "," + margin_left + ")");

    //^ SVG VERTICAL TEXT CREATION//
    graphContainer.append("text").attr("transform", "rotate(-90)").attr("x", -80).attr("y", -50).attr("class", "style_tick").text("Time in Minutes");

    //^ SVG HORIZONTAL TEXT CREATION//
    graphContainer
        .append("text")
        .attr("x", width - margin_left - 10)
        .attr("y", height + margin_bottom + 10)
        .attr("class", "style_tick")
        .text("Years Timeline");

    //! FETCH DATA FUNCTION  //
    const fetchData = async () => {
        const rawData = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json");
        console.log(rawData);
        //^ AXIS SCALE //
        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleTime().range([0, height]);
        let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

        rawData.forEach((d) => {
            d.Place = +d.Place;
            let parsedTime = d.Time.split(":");
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        });
        rawData.forEach((item) => {
            timeLapsList.push(item.Time);
        });
        console.log(timeLapsList);
        console.log(rawData);
        xScale.domain([d3.min(rawData, (d) => d.Year - 1), d3.max(rawData, (d) => d.Year + 1)]);
        yScale.domain(d3.extent(rawData, (d) => d.Time));

        graphContainer
            .append("g")
            .attr("class", "x axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Year");

        graphContainer.append("g").attr("class", "y axis").attr("id", "y-axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Best Time (minutes)");
    };
    fetchData();
});
