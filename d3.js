var dataset;

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then((data) => {
        dataset = data.data;
        yearsFromDataSet = dataset.map(([date, value]) => {
            var newDate = new Date(date)
            return [newDate, value]
        });

        const w = 800;
        const h = 400;
        const padding = 60;
        const barWidth = (w - 2 * padding) / (dataset.length);

        // Define the div for the tooltip
        var div = d3.select("#d3Canvas").append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        const xScale = d3.scaleTime()
            .domain([d3.min(yearsFromDataSet, (d) => d[0]), d3.max(yearsFromDataSet, (d) => d[0])])
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[1])])
            .range([h - padding, padding]);

        const svg = d3.select("#d3Canvas")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("data-date", (d) => d[0])
            .attr("data-gdp", (d) => d[1])
            .attr("x", (d) => xScale(new Date(d[0])))
            .attr("y", (d) => yScale(d[1]))
            .attr("width", barWidth)
            .attr("height", (d) => h - yScale(d[1]) - padding)
            .on("mouseover", function (d) {
                var date = this.getAttribute('data-date');
                var gdp = this.getAttribute('data-gdp');
                div.attr('data-date', date);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(date + "<br/>" + '$' + gdp.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion')
                    .style("left", this.getAttribute('x') + "px")
                    .style("top", 4 * h / 5 + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Create Axises
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);



        // Append X Axis
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        // Append Y Axis
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

    });