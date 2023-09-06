document.addEventListener("DOMContentLoaded", () => {
    //^ CHART CONTAINER DECLARATION//
    const container = document.querySelector(".graph_container");
    //^ API LINK //
    const api_link = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    //^ DIMENTIONS //
    const margin_top = 100;
    const margin_bottom = 30;
    const margin_right = 20;
    const margin_left = 60;

    const width = 920 - margin_left - margin_right;
    const height = 630 - margin_top - margin_bottom;

    // !! CAMBIAR ESCALA DE COLOR  !! //
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);
    // !! CAMBIAR ESCALA DE COLOR  !! //
    const timeFormat = d3.timeFormat("%M:%S");
    //^ TOOLTIP CREATION//
    const tooltipItem = d3.select("body").append("div").attr("class", "tooltip").attr("id", "tooltip");

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
    const fetchData = async (link) => {
        const rawData = await d3.json(link);
        console.log(rawData);
        //^ AXIS SCALE //
        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleTime().range([0, height]);
        let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
        let parsedTime;
        const lista = [];
        //^ TIME STAMP FIX  //

        rawData.forEach((d) => {
            d.Place = +d.Place;
            parsedTime = d.Time.split(":");
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
            lista.push({ Place: d.Place, Time: d.Time });
        });
        console.log(lista);

        //^ ADDING AXIS //

        xScale.domain([d3.min(rawData, (d) => d.Year - 1), d3.max(rawData, (d) => d.Year + 1)]);
        yScale.domain(d3.extent(rawData, (d) => d.Time));

        graphContainer
            .append("g")
            .attr("class", "x axis")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        graphContainer.append("g").attr("class", "y axis").attr("id", "y-axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Best Time (minutes)");

        //^ CREATING INFO DOTS //

        graphContainer
            .selectAll(".dot")
            .data(rawData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 8)
            .attr("cx", (d) => xScale(d.Year))
            .attr("cy", (d) => yScale(d.Time))
            .attr("data-xvalue", (d) => d.Year)
            .attr("data-yvalue", (d) => d.Time.toISOString())
            .style("fill", (d) => colorScale(d.Doping !== ""))
            .on("mouseover", (event, d) => {
                tooltipItem.attr("data-year", d.Year);
                tooltipItem
                    .html(d.Name + ": " + d.Nationality + "<br/>" + "Year: " + d.Year + ", Time: " + timeFormat(d.Time) + (d.Doping ? "<br/><br/>" + d.Doping : ""))
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px")
                    .style("opacity", 1);
            })
            .on("mouseout", () => tooltipItem.style("opacity", 0));

        const legendContainer = graphContainer.append("g").attr("id", "legend");

        const legends = legendContainer
            .selectAll(".legend")
            .data(colorScale.domain())
            .enter()
            .append("g")
            .attr("class", "legend-label")
            .attr("transform", (d, i) => `translate(0,${70 / 2 - i * 30})`);

        legends
            .append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legends
            .append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text((d) => {
                if (d) {
                    return "Riders with doping allegations";
                } else {
                    return "No doping allegations";
                }
            });
    };
    fetchData(api_link);
});
