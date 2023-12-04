// spider chart code came from here:
// https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
// https://gist.github.com/nbremer/21746a9668ffdf6d8242

var months = ['July', 'August', 'September', 'October', 'November', 'December',
                'January', 'February', 'March', 'April', 'May', 'June']

function onCityChanged() {
    var select = d3.select('#citySelect').node();
    var city = select.options[select.selectedIndex].value;
    updateChart(city);
}



// create svg
// let width = 600;
// let height = 600;
// let svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .attr('class', 'leftFloat');

// plot gridlines










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

    updateChart('CLT');
});

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


function updateChart(selectedCity) {
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

    // console.log(avgMinTemp);
    // console.log(avgMaxTemp);

    // convert into proper format
    
    // var temps = [
    //     [// minTemp
    //     {axis: months[0],value: avgMinTemp[0]},
    //     {axis: months[1],value: avgMinTemp[1]},
    //     {axis: months[2],value: avgMinTemp[2]},
    //     {axis: months[3],value: avgMinTemp[3]},
    //     {axis: months[4],value: avgMinTemp[4]},
    //     {axis: months[5],value: avgMinTemp[5]},
    //     {axis: months[6],value: avgMinTemp[6]},
    //     {axis: months[7],value: avgMinTemp[7]},
    //     {axis: months[8],value: avgMinTemp[8]},
    //     {axis: months[9],value: avgMinTemp[9]},
    //     {axis: months[10],value: avgMinTemp[10]},
    //     {axis: months[11],value: avgMinTemp[11]}			
    //     ],[// maxTemp
    //     {axis: months[0],value: avgMaxTemp[0]},
    //     {axis: months[1],value: avgMaxTemp[1]},
    //     {axis: months[2],value: avgMaxTemp[2]},
    //     {axis: months[3],value: avgMaxTemp[3]},
    //     {axis: months[4],value: avgMaxTemp[4]},
    //     {axis: months[5],value: avgMaxTemp[5]},
    //     {axis: months[6],value: avgMaxTemp[6]},
    //     {axis: months[7],value: avgMaxTemp[7]},
    //     {axis: months[8],value: avgMaxTemp[8]},
    //     {axis: months[9],value: avgMaxTemp[9]},
    //     {axis: months[10],value: avgMaxTemp[10]},
    //     {axis: months[11],value: avgMaxTemp[11]}
    //     ]
    // ];

    var temps = [
        {[months[0]]: avgMinTemp[0], [months[1]]: avgMinTemp[1], [months[2]]: avgMinTemp[2],
            [months[3]]: avgMinTemp[3], [months[4]]: avgMinTemp[4], [months[5]]: avgMinTemp[5],
            [months[6]]: avgMinTemp[6], [months[7]]: avgMinTemp[7], [months[8]]: avgMinTemp[8], 
            [months[9]]: avgMinTemp[9], [months[10]]: avgMinTemp[10], [months[11]]: avgMinTemp[11]},
        {[months[0]]: avgMaxTemp[0], [months[1]]: avgMaxTemp[1], [months[2]]: avgMaxTemp[2],
            [months[3]]: avgMaxTemp[3], [months[4]]: avgMaxTemp[4], [months[5]]: avgMaxTemp[5],
            [months[6]]: avgMaxTemp[6], [months[7]]: avgMaxTemp[7], [months[8]]: avgMaxTemp[8], 
            [months[9]]: avgMaxTemp[9], [months[10]]: avgMaxTemp[10], [months[11]]: avgMaxTemp[11]}
    ]

    const container = d3.select('#chart1Container');
    const chart = container.selectAll('.spiderChart').data(temps);

    let width = 600;
    let height = 600;
    const enterChart = chart.enter().append('svg')
        .attr('class', 'spiderChart')
        .attr('width', width)
        .attr('height', height);
    
    const updateChart = enterChart.merge(chart);

    let radialScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 250]);
    let ticks = [2, 4, 6, 8, 10];

    enterChart.selectAll("circle")
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

    enterChart.selectAll(".ticklabel")
    .data(ticks)
    .join(
    enter => enter.append("text")
        .attr("class", "ticklabel")
        .attr("x", width / 2 + 5)
        .attr("y", d => height / 2 - radialScale(d))
        .text(d => d.toString())
    );

    // plotting the axes
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
        "line_coord": angleToCoordinate(angle, 10),
        "label_coord": angleToCoordinate(angle, 10.5)
    };
    });

    // draw axis line
    enterChart.selectAll("line")
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
    enterChart.selectAll(".axislabel")
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
    let colors = ["#CC333F","#00A0B0"];

    function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < months.length; i++){
        let ft_name = months[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / months.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
    }

    enterChart.selectAll("path")
    .data(temps)
    .join(
        enter => enter.append("path")
            .datum(d => getPathCoordinates(d))
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", (_, i) => colors[i])
            .attr("fill", (_, i) => colors[i])
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.5)
    );

    chart.exit().remove();
    
    
    

    // draw and update chart here
    // var color = d3.scale.ordinal()
    //     .range(["#CC333F","#00A0B0"]);
            
    // var radarChartOptions = {
    //     w: width,
    //     h: height,
    //     margin: margin,
    //     maxValue: 0.5,
    //     levels: 5,
    //     roundStrokes: false,
    //     color: color
    // };

    // var svg = d3.select('body').selectAll('.radarChart')
    //     .append('svg')
    //     .attr('width', 600)
    //     .attr('height', 600)

    // //Call function to draw the Radar chart
    // svg.append(RadarChart(".radarChart", temps, radarChartOptions));
}

// function
function RadarChart(id, data, options) {
    var cfg = {
    w: 600,				//Width of the circle
    h: 600,				//Height of the circle
    margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
    levels: 3,				//How many levels or inner circles should there be drawn
    maxValue: 0, 			//What is the value that the biggest circle will represent
    labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, 	//The opacity of the area of the blob
    dotRadius: 4, 			//The size of the colored circles of each blog
    opacityCircles: 0.1, 	//The opacity of the circles of each blob
    strokeWidth: 2, 		//The width of the stroke around each blob
    roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scale.category10()	//Color function
    };
    
    //Put all of the options into a variable called cfg
    if('undefined' !== typeof options){
    for(var i in options){
        if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }//for i
    }//if
    
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        
    var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
        total = allAxis.length,					//The number of different axes
        radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
        Format = d3.format('%'),			 	//Percentage formatting
        angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    
    //Scale for the radius
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);
        
    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    
    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();
    
    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
            .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
            .attr("class", "radar"+id);
    //Append a g element		
    var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////
    
    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");
    
    //Draw the background circles
    axisGrid.selectAll(".levels")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
    .data(d3.range(1,(cfg.levels+1)).reverse())
    .enter().append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function(d){return -d*radius/cfg.levels;})
    .attr("dy", "0.4em")
    .style("font-size", "10px")
    .attr("fill", "#737373")
    .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////
    
    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    
    //The radial line function
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) {	return i*angleSlice; });
        
    if(cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }
                
    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");
            
    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);	
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });
        
    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");		
    
    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
        
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                    
            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });
        
    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text	
    function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            
        while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
        }
    });
    }//wrap	
    
}//RadarChart











































// // spider chart code came from here:
// // https://gist.github.com/nbremer/21746a9668ffdf6d8242


// function onCityChanged() {
//     var select = d3.select('#citySelect').node();
//     var city = select.options[select.selectedIndex].value;
//     updateChart(city);
// }

// var cityMap = {
//     'Charlotte, NC': 'CLT',
//     'Los Angeles, CA': 'CQT',
//     'Indianapolis, IN': 'IND',
//     'Jacksonville, FL': 'JAX',
//     'Chicago, Illinois': 'MDW',
//     'Philadelphia, PA': 'PHL',
//     'Phoenix, AZ': 'PHX'
// }

// // page format
// var margin = {top: 100, right: 100, bottom: 100, left: 100},
//         width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
//         height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

// // global variables
// var CLTdata;
// var CQTdata;
// var INDdata;
// var JAXdata;
// var MDWdata;
// var PHLdata;
// var PHXdata;

// // load data
// Promise.all([
//     d3.csv("CLT.csv"),
//     d3.csv("CQT.csv"),
//     d3.csv("IND.csv"),
//     d3.csv("JAX.csv"),
//     d3.csv("MDW.csv"),
//     d3.csv("PHL.csv"),
//     d3.csv("PHX.csv")
// ]).then(function(files) {
//     CLTdata = files[0];
//     CQTdata = files[1];
//     INDdata = files[2];
//     JAXdata = files[3];
//     MDWdata = files[4];
//     PHLdata = files[5];
//     PHXdata = files[6];

//     updateChart('CLT');
// });

// // calculate avg min and max temp per month
// var daysInMonth = [31, 31, 30, 31, 30, 31, 31, 28, 31, 30, 31, 30];

// function calcAvgMinTemp(dataset) {
//     var monthMinTemp = [];
//     var total = 0;
//     var avg;
//     var rowNum = 0;


//     for (let i = 0; i < 12; i++) {
//         for (let j = 0; j < daysInMonth[i]; j++) {
//             var value = dataset[rowNum].actual_min_temp;
//             total = total + parseInt(value);
//             rowNum = rowNum + 1;
//         }
//         avg = total / daysInMonth[i];
//         monthMinTemp.push(Math.round(avg));
//         total = 0;
//         avg = 0;
//     }
//     return monthMinTemp;
// }

// function calcAvgMaxTemp(dataset) {
//     var monthMaxTemp = [];
//     var total = 0;
//     var avg;
//     var rowNum = 0;


//     for (let i = 0; i < 12; i++) {
//         for (let j = 0; j < daysInMonth[i]; j++) {
//             var value = dataset[rowNum].actual_max_temp;
//             total = total + parseInt(value);
//             rowNum = rowNum + 1;
//         }
//         avg = total / daysInMonth[i];
//         monthMaxTemp.push(Math.round(avg));
//         total = 0;
//         avg = 0;
//     }
//     return monthMaxTemp;
// }


// function updateChart(selectedCity) {
//     var selectedData;
    
//     // Set selectedData based on the chosen city
//     switch (selectedCity) {
//         case 'CLT':
//             selectedData = CLTdata;
//             break;
//         case 'CQT':
//             selectedData = CQTdata;
//             break;
//         case 'IND':
//             selectedData = INDdata;
//             break;
//         case 'JAX':
//             selectedData = JAXdata;
//             break;
//         case 'MDW':
//             selectedData = MDWdata;
//             break;
//         case 'PHL':
//             selectedData = PHLdata;
//             break;
//         case 'PHX':
//             selectedData = PHXdata;
//             break;
//         default:
//             console.error('Invalid city selection');
//             return;
//     }

//     var avgMinTemp = calcAvgMinTemp(selectedData);
//     var avgMaxTemp = calcAvgMaxTemp(selectedData);

//     // convert into proper format
//     var months = ['July', 'August', 'September', 'October', 'November', 'December',
//                 'January', 'February', 'March', 'April', 'May', 'June']
//     var data = [
//             [// minTemp
//             {axis: months[0],value: avgMinTemp[0]},
//             {axis: months[1],value: avgMinTemp[1]},
//             {axis: months[2],value: avgMinTemp[2]},
//             {axis: months[3],value: avgMinTemp[3]},
//             {axis: months[4],value: avgMinTemp[4]},
//             {axis: months[5],value: avgMinTemp[5]},
//             {axis: months[6],value: avgMinTemp[6]},
//             {axis: months[7],value: avgMinTemp[7]},
//             {axis: months[8],value: avgMinTemp[8]},
//             {axis: months[9],value: avgMinTemp[9]},
//             {axis: months[10],value: avgMinTemp[10]},
//             {axis: months[11],value: avgMinTemp[11]}			
//             ],[// maxTemp
//             {axis: months[0],value: avgMaxTemp[0]},
//             {axis: months[1],value: avgMaxTemp[1]},
//             {axis: months[2],value: avgMaxTemp[2]},
//             {axis: months[3],value: avgMaxTemp[3]},
//             {axis: months[4],value: avgMaxTemp[4]},
//             {axis: months[5],value: avgMaxTemp[5]},
//             {axis: months[6],value: avgMaxTemp[6]},
//             {axis: months[7],value: avgMaxTemp[7]},
//             {axis: months[8],value: avgMaxTemp[8]},
//             {axis: months[9],value: avgMaxTemp[9]},
//             {axis: months[10],value: avgMaxTemp[10]},
//             {axis: months[11],value: avgMaxTemp[11]}
//             ]
//         ];

//     // draw and update chart here
//     var color = d3.scale.ordinal()
//         .range(["#CC333F","#00A0B0"]);
            
//     var radarChartOptions = {
//         w: width,
//         h: height,
//         margin: margin,
//         maxValue: 0.5,
//         levels: 5,
//         roundStrokes: false,
//         color: color
//     };

//     var svg = d3.select('body').selectAll('.radarChart')
//         .append('svg')
//         .attr('width', 600)
//         .attr('height', 600)

//     //Call function to draw the Radar chart
//     svg.append(RadarChart(".radarChart", data, radarChartOptions));
// }

// // function
// function RadarChart(id, data, options) {
//     var cfg = {
//     w: 600,				//Width of the circle
//     h: 600,				//Height of the circle
//     margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
//     levels: 3,				//How many levels or inner circles should there be drawn
//     maxValue: 0, 			//What is the value that the biggest circle will represent
//     labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
//     wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
//     opacityArea: 0.35, 	//The opacity of the area of the blob
//     dotRadius: 4, 			//The size of the colored circles of each blog
//     opacityCircles: 0.1, 	//The opacity of the circles of each blob
//     strokeWidth: 2, 		//The width of the stroke around each blob
//     roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
//     color: d3.scale.category10()	//Color function
//     };
    
//     //Put all of the options into a variable called cfg
//     if('undefined' !== typeof options){
//     for(var i in options){
//         if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
//     }//for i
//     }//if
    
//     //If the supplied maxValue is smaller than the actual one, replace by the max in the data
//     var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
        
//     var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
//         total = allAxis.length,					//The number of different axes
//         radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
//         Format = d3.format('%'),			 	//Percentage formatting
//         angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
    
//     //Scale for the radius
//     var rScale = d3.scale.linear()
//         .range([0, radius])
//         .domain([0, maxValue]);
        
//     /////////////////////////////////////////////////////////
//     //////////// Create the container SVG and g /////////////
//     /////////////////////////////////////////////////////////

//     //Remove whatever chart with the same id/class was present before
//     d3.select(id).select("svg").remove();
    
//     //Initiate the radar chart SVG
//     var svg = d3.select(id).append("svg")
//             .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
//             .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
//             .attr("class", "radar"+id);
//     //Append a g element		
//     var g = svg.append("g")
//             .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
//     /////////////////////////////////////////////////////////
//     ////////// Glow filter for some extra pizzazz ///////////
//     /////////////////////////////////////////////////////////
    
//     //Filter for the outside glow
//     var filter = g.append('defs').append('filter').attr('id','glow'),
//         feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
//         feMerge = filter.append('feMerge'),
//         feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
//         feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

//     /////////////////////////////////////////////////////////
//     /////////////// Draw the Circular grid //////////////////
//     /////////////////////////////////////////////////////////
    
//     //Wrapper for the grid & axes
//     var axisGrid = g.append("g").attr("class", "axisWrapper");
    
//     //Draw the background circles
//     axisGrid.selectAll(".levels")
//     .data(d3.range(1,(cfg.levels+1)).reverse())
//     .enter()
//         .append("circle")
//         .attr("class", "gridCircle")
//         .attr("r", function(d, i){return radius/cfg.levels*d;})
//         .style("fill", "#CDCDCD")
//         .style("stroke", "#CDCDCD")
//         .style("fill-opacity", cfg.opacityCircles)
//         .style("filter" , "url(#glow)");

//     //Text indicating at what % each level is
//     axisGrid.selectAll(".axisLabel")
//     .data(d3.range(1,(cfg.levels+1)).reverse())
//     .enter().append("text")
//     .attr("class", "axisLabel")
//     .attr("x", 4)
//     .attr("y", function(d){return -d*radius/cfg.levels;})
//     .attr("dy", "0.4em")
//     .style("font-size", "10px")
//     .attr("fill", "#737373")
//     .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

//     /////////////////////////////////////////////////////////
//     //////////////////// Draw the axes //////////////////////
//     /////////////////////////////////////////////////////////
    
//     //Create the straight lines radiating outward from the center
//     var axis = axisGrid.selectAll(".axis")
//         .data(allAxis)
//         .enter()
//         .append("g")
//         .attr("class", "axis");
//     //Append the lines
//     axis.append("line")
//         .attr("x1", 0)
//         .attr("y1", 0)
//         .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
//         .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
//         .attr("class", "line")
//         .style("stroke", "white")
//         .style("stroke-width", "2px");

//     //Append the labels at each axis
//     axis.append("text")
//         .attr("class", "legend")
//         .style("font-size", "11px")
//         .attr("text-anchor", "middle")
//         .attr("dy", "0.35em")
//         .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
//         .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
//         .text(function(d){return d})
//         .call(wrap, cfg.wrapWidth);

//     /////////////////////////////////////////////////////////
//     ///////////// Draw the radar chart blobs ////////////////
//     /////////////////////////////////////////////////////////
    
//     //The radial line function
//     var radarLine = d3.svg.line.radial()
//         .interpolate("linear-closed")
//         .radius(function(d) { return rScale(d.value); })
//         .angle(function(d,i) {	return i*angleSlice; });
        
//     if(cfg.roundStrokes) {
//         radarLine.interpolate("cardinal-closed");
//     }
                
//     //Create a wrapper for the blobs	
//     var blobWrapper = g.selectAll(".radarWrapper")
//         .data(data)
//         .enter().append("g")
//         .attr("class", "radarWrapper");
            
//     //Append the backgrounds	
//     blobWrapper
//         .append("path")
//         .attr("class", "radarArea")
//         .attr("d", function(d,i) { return radarLine(d); })
//         .style("fill", function(d,i) { return cfg.color(i); })
//         .style("fill-opacity", cfg.opacityArea)
//         .on('mouseover', function (d,i){
//             //Dim all blobs
//             d3.selectAll(".radarArea")
//                 .transition().duration(200)
//                 .style("fill-opacity", 0.1); 
//             //Bring back the hovered over blob
//             d3.select(this)
//                 .transition().duration(200)
//                 .style("fill-opacity", 0.7);	
//         })
//         .on('mouseout', function(){
//             //Bring back all blobs
//             d3.selectAll(".radarArea")
//                 .transition().duration(200)
//                 .style("fill-opacity", cfg.opacityArea);
//         });
        
//     //Create the outlines	
//     blobWrapper.append("path")
//         .attr("class", "radarStroke")
//         .attr("d", function(d,i) { return radarLine(d); })
//         .style("stroke-width", cfg.strokeWidth + "px")
//         .style("stroke", function(d,i) { return cfg.color(i); })
//         .style("fill", "none")
//         .style("filter" , "url(#glow)");		
    
//     //Append the circles
//     blobWrapper.selectAll(".radarCircle")
//         .data(function(d,i) { return d; })
//         .enter().append("circle")
//         .attr("class", "radarCircle")
//         .attr("r", cfg.dotRadius)
//         .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
//         .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
//         .style("fill", function(d,i,j) { return cfg.color(j); })
//         .style("fill-opacity", 0.8);

//     /////////////////////////////////////////////////////////
//     //////// Append invisible circles for tooltip ///////////
//     /////////////////////////////////////////////////////////
    
//     //Wrapper for the invisible circles on top
//     var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
//         .data(data)
//         .enter().append("g")
//         .attr("class", "radarCircleWrapper");
        
//     //Append a set of invisible circles on top for the mouseover pop-up
//     blobCircleWrapper.selectAll(".radarInvisibleCircle")
//         .data(function(d,i) { return d; })
//         .enter().append("circle")
//         .attr("class", "radarInvisibleCircle")
//         .attr("r", cfg.dotRadius*1.5)
//         .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
//         .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
//         .style("fill", "none")
//         .style("pointer-events", "all")
//         .on("mouseover", function(d,i) {
//             newX =  parseFloat(d3.select(this).attr('cx')) - 10;
//             newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                    
//             tooltip
//                 .attr('x', newX)
//                 .attr('y', newY)
//                 .text(Format(d.value))
//                 .transition().duration(200)
//                 .style('opacity', 1);
//         })
//         .on("mouseout", function(){
//             tooltip.transition().duration(200)
//                 .style("opacity", 0);
//         });
        
//     //Set up the small tooltip for when you hover over a circle
//     var tooltip = g.append("text")
//         .attr("class", "tooltip")
//         .style("opacity", 0);
    
//     /////////////////////////////////////////////////////////
//     /////////////////// Helper Function /////////////////////
//     /////////////////////////////////////////////////////////

//     //Taken from http://bl.ocks.org/mbostock/7555321
//     //Wraps SVG text	
//     function wrap(text, width) {
//     text.each(function() {
//         var text = d3.select(this),
//             words = text.text().split(/\s+/).reverse(),
//             word,
//             line = [],
//             lineNumber = 0,
//             lineHeight = 1.4, // ems
//             y = text.attr("y"),
//             x = text.attr("x"),
//             dy = parseFloat(text.attr("dy")),
//             tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            
//         while (word = words.pop()) {
//         line.push(word);
//         tspan.text(line.join(" "));
//         if (tspan.node().getComputedTextLength() > width) {
//             line.pop();
//             tspan.text(line.join(" "));
//             line = [word];
//             tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//         }
//         }
//     });
//     }//wrap	
    
// }//RadarChart





















// var margin = {top: 100, right: 100, bottom: 100, left: 100},
//         width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
//         height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

// var months = ['July', 'August', 'September', 'October', 'November', 'December',
//                 'January', 'February', 'March', 'April', 'May', 'June']
// // data
// var data = [
//             [//iPhone
//             {axis: months[0],value:0.22},
//             {axis: months[1],value:0.28},
//             {axis: months[2],value:0.29},
//             {axis: months[3],value:0.17},
//             {axis: months[4],value:0.22},
//             {axis: months[5],value:0.02},
//             {axis: months[6],value:0.21},
//             {axis: months[7],value:0.50},
//             {axis: months[8],value:0.50},
//             {axis: months[9],value:0.50},
//             {axis: months[10],value:0.50},
//             {axis: months[11],value:0.50}			
//             ],[//Samsung
//             {axis: months[0],value:0.27},
//             {axis: months[1],value:0.16},
//             {axis: months[2],value:0.35},
//             {axis: months[3],value:0.13},
//             {axis: months[4],value:0.20},
//             {axis: months[5],value:0.13},
//             {axis: months[6],value:0.35},
//             {axis: months[7],value:0.38},
//             {axis: months[8],value:0.38},
//             {axis: months[9],value:0.38},
//             {axis: months[10],value:0.38},
//             {axis: months[11],value:0.38}
//             ]
//         ];

// var color = d3.scale.ordinal()
// .range(["#CC333F","#00A0B0"]);
        
// var radarChartOptions = {
//     w: width,
//     h: height,
//     margin: margin,
//     maxValue: 0.5,
//     levels: 5,
//     roundStrokes: false,
//     color: color
// };

// var svg = d3.select('body').selectAll('div')
//     .append('svg')
//     .attr('width', 600)
//     .attr('height', 600)

// //Call function to draw the Radar chart
// svg.append(RadarChart(".radarChart", data, radarChartOptions));

// // function
// function RadarChart(id, data, options) {
// 	var cfg = {
// 	 w: 600,				//Width of the circle
// 	 h: 600,				//Height of the circle
// 	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
// 	 levels: 3,				//How many levels or inner circles should there be drawn
// 	 maxValue: 0, 			//What is the value that the biggest circle will represent
// 	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
// 	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
// 	 opacityArea: 0.35, 	//The opacity of the area of the blob
// 	 dotRadius: 4, 			//The size of the colored circles of each blog
// 	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
// 	 strokeWidth: 2, 		//The width of the stroke around each blob
// 	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
// 	 color: d3.scale.category10()	//Color function
// 	};
	
// 	//Put all of the options into a variable called cfg
// 	if('undefined' !== typeof options){
// 	  for(var i in options){
// 		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
// 	  }//for i
// 	}//if
	
// 	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
// 	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
// 	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
// 		total = allAxis.length,					//The number of different axes
// 		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
// 		Format = d3.format('%'),			 	//Percentage formatting
// 		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
// 	//Scale for the radius
// 	var rScale = d3.scale.linear()
// 		.range([0, radius])
// 		.domain([0, maxValue]);
		
// 	/////////////////////////////////////////////////////////
// 	//////////// Create the container SVG and g /////////////
// 	/////////////////////////////////////////////////////////

// 	//Remove whatever chart with the same id/class was present before
// 	d3.select(id).select("svg").remove();
	
// 	//Initiate the radar chart SVG
// 	var svg = d3.select(id).append("svg")
// 			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
// 			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
// 			.attr("class", "radar"+id);
// 	//Append a g element		
// 	var g = svg.append("g")
// 			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
// 	/////////////////////////////////////////////////////////
// 	////////// Glow filter for some extra pizzazz ///////////
// 	/////////////////////////////////////////////////////////
	
// 	//Filter for the outside glow
// 	var filter = g.append('defs').append('filter').attr('id','glow'),
// 		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
// 		feMerge = filter.append('feMerge'),
// 		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
// 		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

// 	/////////////////////////////////////////////////////////
// 	/////////////// Draw the Circular grid //////////////////
// 	/////////////////////////////////////////////////////////
	
// 	//Wrapper for the grid & axes
// 	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
// 	//Draw the background circles
// 	axisGrid.selectAll(".levels")
// 	   .data(d3.range(1,(cfg.levels+1)).reverse())
// 	   .enter()
// 		.append("circle")
// 		.attr("class", "gridCircle")
// 		.attr("r", function(d, i){return radius/cfg.levels*d;})
// 		.style("fill", "#CDCDCD")
// 		.style("stroke", "#CDCDCD")
// 		.style("fill-opacity", cfg.opacityCircles)
// 		.style("filter" , "url(#glow)");

// 	//Text indicating at what % each level is
// 	axisGrid.selectAll(".axisLabel")
// 	   .data(d3.range(1,(cfg.levels+1)).reverse())
// 	   .enter().append("text")
// 	   .attr("class", "axisLabel")
// 	   .attr("x", 4)
// 	   .attr("y", function(d){return -d*radius/cfg.levels;})
// 	   .attr("dy", "0.4em")
// 	   .style("font-size", "10px")
// 	   .attr("fill", "#737373")
// 	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

// 	/////////////////////////////////////////////////////////
// 	//////////////////// Draw the axes //////////////////////
// 	/////////////////////////////////////////////////////////
	
// 	//Create the straight lines radiating outward from the center
// 	var axis = axisGrid.selectAll(".axis")
// 		.data(allAxis)
// 		.enter()
// 		.append("g")
// 		.attr("class", "axis");
// 	//Append the lines
// 	axis.append("line")
// 		.attr("x1", 0)
// 		.attr("y1", 0)
// 		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.attr("class", "line")
// 		.style("stroke", "white")
// 		.style("stroke-width", "2px");

// 	//Append the labels at each axis
// 	axis.append("text")
// 		.attr("class", "legend")
// 		.style("font-size", "11px")
// 		.attr("text-anchor", "middle")
// 		.attr("dy", "0.35em")
// 		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.text(function(d){return d})
// 		.call(wrap, cfg.wrapWidth);

// 	/////////////////////////////////////////////////////////
// 	///////////// Draw the radar chart blobs ////////////////
// 	/////////////////////////////////////////////////////////
	
// 	//The radial line function
// 	var radarLine = d3.svg.line.radial()
// 		.interpolate("linear-closed")
// 		.radius(function(d) { return rScale(d.value); })
// 		.angle(function(d,i) {	return i*angleSlice; });
		
// 	if(cfg.roundStrokes) {
// 		radarLine.interpolate("cardinal-closed");
// 	}
				
// 	//Create a wrapper for the blobs	
// 	var blobWrapper = g.selectAll(".radarWrapper")
// 		.data(data)
// 		.enter().append("g")
// 		.attr("class", "radarWrapper");
			
// 	//Append the backgrounds	
// 	blobWrapper
// 		.append("path")
// 		.attr("class", "radarArea")
// 		.attr("d", function(d,i) { return radarLine(d); })
// 		.style("fill", function(d,i) { return cfg.color(i); })
// 		.style("fill-opacity", cfg.opacityArea)
// 		.on('mouseover', function (d,i){
// 			//Dim all blobs
// 			d3.selectAll(".radarArea")
// 				.transition().duration(200)
// 				.style("fill-opacity", 0.1); 
// 			//Bring back the hovered over blob
// 			d3.select(this)
// 				.transition().duration(200)
// 				.style("fill-opacity", 0.7);	
// 		})
// 		.on('mouseout', function(){
// 			//Bring back all blobs
// 			d3.selectAll(".radarArea")
// 				.transition().duration(200)
// 				.style("fill-opacity", cfg.opacityArea);
// 		});
		
// 	//Create the outlines	
// 	blobWrapper.append("path")
// 		.attr("class", "radarStroke")
// 		.attr("d", function(d,i) { return radarLine(d); })
// 		.style("stroke-width", cfg.strokeWidth + "px")
// 		.style("stroke", function(d,i) { return cfg.color(i); })
// 		.style("fill", "none")
// 		.style("filter" , "url(#glow)");		
	
// 	//Append the circles
// 	blobWrapper.selectAll(".radarCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarCircle")
// 		.attr("r", cfg.dotRadius)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", function(d,i,j) { return cfg.color(j); })
// 		.style("fill-opacity", 0.8);

// 	/////////////////////////////////////////////////////////
// 	//////// Append invisible circles for tooltip ///////////
// 	/////////////////////////////////////////////////////////
	
// 	//Wrapper for the invisible circles on top
// 	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
// 		.data(data)
// 		.enter().append("g")
// 		.attr("class", "radarCircleWrapper");
		
// 	//Append a set of invisible circles on top for the mouseover pop-up
// 	blobCircleWrapper.selectAll(".radarInvisibleCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarInvisibleCircle")
// 		.attr("r", cfg.dotRadius*1.5)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", "none")
// 		.style("pointer-events", "all")
// 		.on("mouseover", function(d,i) {
// 			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
// 			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
// 			tooltip
// 				.attr('x', newX)
// 				.attr('y', newY)
// 				.text(Format(d.value))
// 				.transition().duration(200)
// 				.style('opacity', 1);
// 		})
// 		.on("mouseout", function(){
// 			tooltip.transition().duration(200)
// 				.style("opacity", 0);
// 		});
		
// 	//Set up the small tooltip for when you hover over a circle
// 	var tooltip = g.append("text")
// 		.attr("class", "tooltip")
// 		.style("opacity", 0);
	
// 	/////////////////////////////////////////////////////////
// 	/////////////////// Helper Function /////////////////////
// 	/////////////////////////////////////////////////////////

// 	//Taken from http://bl.ocks.org/mbostock/7555321
// 	//Wraps SVG text	
// 	function wrap(text, width) {
// 	  text.each(function() {
// 		var text = d3.select(this),
// 			words = text.text().split(/\s+/).reverse(),
// 			word,
// 			line = [],
// 			lineNumber = 0,
// 			lineHeight = 1.4, // ems
// 			y = text.attr("y"),
// 			x = text.attr("x"),
// 			dy = parseFloat(text.attr("dy")),
// 			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
// 		while (word = words.pop()) {
// 		  line.push(word);
// 		  tspan.text(line.join(" "));
// 		  if (tspan.node().getComputedTextLength() > width) {
// 			line.pop();
// 			tspan.text(line.join(" "));
// 			line = [word];
// 			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
// 		  }
// 		}
// 	  });
// 	}//wrap	
	
// }//RadarChart

























// // Global function called when select element is changed
// function onCity1Changed() {
//     var select = d3.select('#city2Select').node();
//     // Get current value of select element
//     var category = select.options[select.selectedIndex].value;
//     // Update chart with the selected category of letters
//     updateChart(category);
// }

// // map with arrays to each csv file of the city sets
// var cityMap = {
//     'Charlotte, NC': 'CLT',
//     'Los Angeles, CA': 'CQT',
//     'Indianapolis, IN': 'IND',
//     'Jacksonville, FL': 'JAX',
//     'Chicago, Illinois': 'MDW',
//     'Philadelphia, PA': 'PHL',
//     'Phoenix, AZ': 'PHX'
// }


// let data = [];
// let features = ["July", "June", "May", "Apr", "March", "Feb", "Jan", "Dec", "Nov", "Oct", "Sept", "Aug"];
// //generate the data
// for (var i = 0; i < 3; i++){
//     var point = {}
//     //each feature will be a random number from 1-9
//     features.forEach(f => point[f] = 1 + Math.random() * 8);
//     data.push(point);
// }
// console.log(data);


// let width = 700;
// let height = 600;
// let svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);



// // plotting the gridlines
// let radialScale = d3.scaleLinear()
// .domain([0, 10])
// .range([0, 250]);
// let ticks = [2, 4, 6, 8, 10];

// // create spider chart
// svg.selectAll("circle")
//     .data(ticks)
//     .join(
//         enter => enter.append("circle")
//             .attr("cx", width / 2)
//             .attr("cy", height / 2)
//             .attr("fill", "none")
//             .attr("stroke", "gray")
//             .attr("r", d => radialScale(d))
//     );

// // create text labels for ticks
// svg.selectAll(".ticklabel")
//     .data(ticks)
//     .join(
//         enter => enter.append("text")
//             .attr("class", "ticklabel")
//             .attr("x", width / 2 + 5)
//             .attr("y", d => height / 2 - radialScale(d))
//             .text(d => d.toString())
//     );


// // plotting the axes
// function angleToCoordinate(angle, value){
//     let x = Math.cos(angle) * radialScale(value);
//     let y = Math.sin(angle) * radialScale(value);
//     return {"x": width / 2 + x, "y": height / 2 - y};
// }


// let featureData = features.map((f, i) => {
//     let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
//     return {
//         "name": f,
//         "angle": angle,
//         "line_coord": angleToCoordinate(angle, 10),
//         "label_coord": angleToCoordinate(angle, 10.5)
//     };
// });

// // draw axis line
// svg.selectAll("line")
//     .data(featureData)
//     .join(
//         enter => enter.append("line")
//             .attr("x1", width / 2)
//             .attr("y1", height / 2)
//             .attr("x2", d => d.line_coord.x)
//             .attr("y2", d => d.line_coord.y)
//             .attr("stroke","black")
//     );

// // draw axis label
// svg.selectAll(".axislabel")
//     .data(featureData)
//     .join(
//         enter => enter.append("text")
//             .attr("x", d => d.label_coord.x)
//             .attr("y", d => d.label_coord.y)
//             .text(d => d.name)
//     );

// // plotting the data
// let line = d3.line()
//     .x(d => d.x)
//     .y(d => d.y);
// let colors = ["darkorange", "gray", "navy"];

// // helper function
// function getPathCoordinates(data_point){
//     let coordinates = [];
//     for (var i = 0; i < features.length; i++){
//         let ft_name = features[i];
//         let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
//         coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
//     }
//     return coordinates;
// }

// // draw the path element
// svg.selectAll("path")
//     .data(data)
//     .join(
//         enter => enter.append("path")
//             .datum(d => getPathCoordinates(d))
//             .attr("d", line)
//             .attr("stroke-width", 3)
//             .attr("stroke", (_, i) => colors[i])
//             .attr("fill", (_, i) => colors[i])
//             .attr("stroke-opacity", 1)
//             .attr("opacity", 0.5)
//     );




// d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
//     // Create global variables here and intialize the chart
//     letters = dataset;
//     widthScale = d3.scaleLinear()
//         .domain([0, d3.max(letters, function(d) { return d.frequency })])
//         .range([0, chartWidth]);

//     // **** Your JavaScript code goes here ****
//     let sliderDiv = d3.select("#slider-container");

//     let selectionLayout = {
//         width: 600,
//         height: 100,
//         margin: { top: 20, right: 40, bottom: 30, left: 40 }
//     };

//     let sliderContainer = sliderDiv.select("svg");

//     if (sliderContainer.empty()) {
//         sliderContainer = slider(selectionLayout, d3)(0.00, 0.15);
//         sliderDiv.node().appendChild(sliderContainer);
//     }
//     else {
//         sliderContainer.call(brush.move, [rangeMin, rangeMax].map(frequency));
//     }

//     sliderContainer.addEventListener("input", function() {
//         rangeMin = sliderContainer.value[0];
//         rangeMax = sliderContainer.value[1];

//         var select = d3.select('#categorySelect').node();
//         var category = select.options[select.selectedIndex].value;

//         updateChart(category);
//     });

//     // Update the chart for all letters to initialize
//     updateChart('all-letters');
// });



// function updateChart() {

// }