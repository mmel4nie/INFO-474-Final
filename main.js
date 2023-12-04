// creating legend
var legend = d3.select('#legend');
legend.append("circle").attr("cx",75).attr("cy",35).attr("r", 6).style("fill", "#00A0B0")
legend.append("text").attr("x", 85).attr("y", 35).text("actual min temp").style("font-size", "15px")

legend.append("circle").attr("cx",250).attr("cy",35).attr("r", 6).style("fill", "#CC333F")
legend.append("text").attr("x", 260).attr("y", 35).text("actual max temp").style("font-size", "15px")

function onCity1Changed() {
    var select = d3.select('#city1Select').node();
    var city = select.options[select.selectedIndex].value;
    updateChart(city, svg1, chartG1);
}

function onCity2Changed() {
    var select = d3.select('#city2Select').node();
    var city = select.options[select.selectedIndex].value;
    updateChart(city, svg2, chartG2);
}

let width = 600;
let height = 600;

// city 1
let svg1 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var chartG1 = svg1.append('g');

// city 2
let svg2 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var chartG2 = svg2.append('g');

let months = ['July', 'August', 'September', 'October', 'November', 'December',
    'January', 'February', 'March', 'April', 'May', 'June'];

// calculate avg min and max temp per month
var daysInMonth = [31, 31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30];

function calcAvgMinTemp(dataset) {
    var monthMinTemp = [];
    var total = 0;
    var avg;
    var rowNum = 0;


    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < daysInMonth[i]; j++) {
            var value = dataset[rowNum].actual_min_temp;
            total = total + parseInt(value);
            rowNum = rowNum + 1;
        }
        avg = total / daysInMonth[i];
        monthMinTemp.push(Math.round(avg));
        total = 0;
        avg = 0;
    }
    return monthMinTemp;
}

function calcAvgMaxTemp(dataset) {
    var monthMaxTemp = [];
    var total = 0;
    var avg;
    var rowNum = 0;


    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < daysInMonth[i]; j++) {
            var value = dataset[rowNum].actual_max_temp;
            total = total + parseInt(value);
            rowNum = rowNum + 1;
        }
        avg = total / daysInMonth[i];
        monthMaxTemp.push(Math.round(avg));
        total = 0;
        avg = 0;
    }
    return monthMaxTemp;
}



// global variables
var CLTdata;
var CQTdata;
var INDdata;
var JAXdata;
var MDWdata;
var PHLdata;
var PHXdata;

// load data
Promise.all([
    d3.csv("CLT.csv"),
    d3.csv("CQT.csv"),
    d3.csv("IND.csv"),
    d3.csv("JAX.csv"),
    d3.csv("MDW.csv"),
    d3.csv("PHL.csv"),
    d3.csv("PHX.csv")
]).then(function(files) {
    CLTdata = files[0];
    CQTdata = files[1];
    INDdata = files[2];
    JAXdata = files[3];
    MDWdata = files[4];
    PHLdata = files[5];
    PHXdata = files[6];

    updateChart('CLT', svg1, chartG1);
    updateChart('CLT', svg2, chartG2);
});

function updateChart(selectedCity, svg, chartG) {
    var selectedData;
    
    // Set selectedData based on the chosen city
    switch (selectedCity) {
        case 'CLT':
            selectedData = CLTdata;
            break;
        case 'CQT':
            selectedData = CQTdata;
            break;
        case 'IND':
            selectedData = INDdata;
            break;
        case 'JAX':
            selectedData = JAXdata;
            break;
        case 'MDW':
            selectedData = MDWdata;
            break;
        case 'PHL':
            selectedData = PHLdata;
            break;
        case 'PHX':
            selectedData = PHXdata;
            break;
        default:
            console.error('Invalid city selection');
            return;
    }

    var avgMinTemp = calcAvgMinTemp(selectedData);
    var avgMaxTemp = calcAvgMaxTemp(selectedData);

    var data = [
        {[months[0]]: avgMinTemp[0], [months[1]]: avgMinTemp[1], [months[2]]: avgMinTemp[2],
            [months[3]]: avgMinTemp[3], [months[4]]: avgMinTemp[4], [months[5]]: avgMinTemp[5],
            [months[6]]: avgMinTemp[6], [months[7]]: avgMinTemp[7], [months[8]]: avgMinTemp[8], 
            [months[9]]: avgMinTemp[9], [months[10]]: avgMinTemp[10], [months[11]]: avgMinTemp[11]},
        {[months[0]]: avgMaxTemp[0], [months[1]]: avgMaxTemp[1], [months[2]]: avgMaxTemp[2],
            [months[3]]: avgMaxTemp[3], [months[4]]: avgMaxTemp[4], [months[5]]: avgMaxTemp[5],
            [months[6]]: avgMaxTemp[6], [months[7]]: avgMaxTemp[7], [months[8]]: avgMaxTemp[8], 
            [months[9]]: avgMaxTemp[9], [months[10]]: avgMaxTemp[10], [months[11]]: avgMaxTemp[11]}
    ]

    let radialScale = d3.scaleLinear()
    .domain([0, 125])
    .range([0, 250]);
    let ticks = [25, 50, 75, 100, 125];

    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("fill", "#CDCDCD")
                .attr("stroke", "#CDCDCD")
                .style("fill-opacity", 0.1)
                .attr("r", d => radialScale(d))
        );

    svg.selectAll(".ticklabel")
        .data(ticks)
        .join(
            enter => enter.append("text")
                .attr("class", "ticklabel")
                .attr("x", width / 2 + 5)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString())
        );

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": width / 2 + x, "y": height / 2 - y};
    }

    let featureData = months.map((f, i) => {
        let angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, 125),
            "label_coord": angleToCoordinate(angle, 130)
        };
    });

    // draw axis line
    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width / 2)
                .attr("y1", height / 2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke","white")
                .attr("stroke-width", "2px")
        );

    // draw axis label
    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x)
                .attr("y", d => d.label_coord.y)
                .text(d => d.name)
        );

    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
    let colors = ["#00A0B0", "#CC333F"];

    function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < months.length; i++){
            let ft_name = months[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        }
        let ft_name = months[0];
        let angle = (Math.PI / 2) + (2 * Math.PI * 0 / months.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        return coordinates;
    }

    var paths = chartG.selectAll('.path')
        .data(data);

    var pathsEnter = paths.enter()
        .append('g')
        .attr('class', 'path');

    pathsEnter.append('path')
        .datum(d => getPathCoordinates(d))
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", (_, i) => colors[i])
            .attr("fill", (_, i) => colors[i])
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.5)
            .attr("fill-opacity", 0.2);

    var pathsMerge = pathsEnter.merge(paths);


    pathsMerge.select('path')
        .datum(d => getPathCoordinates(d))
        .transition()
        .duration(1000) // Adjust the transition duration as needed
        .attr("d", line)
        .attr("stroke", (_, i) => colors[i])
        .attr("fill", (_, i) => colors[i]);

    paths.exit().remove();



    // var points = chartG.selectAll('.point')
    //     .data(data);
    
    // var pointsEnter = points.enter()
    //     .append('g')
    //     .attr('class', 'point')

    // pointsEnter.selectAll('circle') // Add this line to select existing circles or create new ones
    //     .data(d => getPathCoordinates(d)) // Use the same data as the path
    //     .enter()
    //     .append('circle')
    //     .attr("cx", d => d.x) // Use the x coordinate from the path data
    //     .attr("cy", d => d.y) // Use the y coordinate from the path data
    //     .attr("r", 5) // Adjust the radius as needed
    //     .attr("fill", (_, i) => colors[i]);

    // var pointsMerge = pointsEnter.merge(points);

    // pointsMerge.selectAll('circle') // Select the circles
    //     .data(d => getPathCoordinates(d)) // Use the same data as the path
    //     .enter()
    //     .append('circle')
    //     .transition()
    //     .duration(1000) // Adjust the transition duration as needed
    //     .attr("cx", d => d.x) // Use the x coordinate from the path data
    //     .attr("cy", d => d.y) // Use the y coordinate from the path data
    //     .attr("r", 5) // Adjust the radius as needed
    //     .attr("fill", (_, i) => colors[i]);

    // pointsMerge.select('circle') // Select the circles
    //     .datum(d => getPathCoordinates(d))
    //     .transition()
    //     .duration(1000) // Adjust the transition duration as needed
    //     .attr("cx", d => d.x) // Use the x coordinate from the path data
    //     .attr("cy", d => d.y) // Use the y coordinate from the path data
    //     .attr("r", 5) // Adjust the radius as needed
    //     .attr("fill", (_, i) => colors[i]);

    // points.exit().remove();
}