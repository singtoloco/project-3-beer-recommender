
function init() {
    d3.csv("static/Files/allBeers.csv", function (csv) {
        keys = csv;

        start();
        // createAvgBarChart();
        
        d3.select('#submit_btn').on('click', runModel);
    });
}

function findInput() {

    var url = `/input`;
    listBeers(data);
}

//Setup and render the autocomplete
function start() {
    var mc = autocomplete(document.getElementById('beer_1'))
        .keys(keys)
        .dataField("beer_name")
        .placeHolder("90 Minute IPA")
        .width(960)
        .height(500)
        .render();
    
    var mc2 = autocomplete(document.getElementById('beer_2'))
        .keys(keys)
        .dataField("beer_name")
        .placeHolder("Founders Breakfast Stout")
        .width(960)
        .height(500)
        .render();
    
    var mc3 = autocomplete(document.getElementById('beer_3'))
        .keys(keys)
        .dataField("beer_name")
        .placeHolder("Stella Artois")
        .width(960)
        .height(500)
        .render();
}

// 
// function createCategoryChart(data, label) {

//     data.forEach(item => { console.log(item.main_style) });
    
//     // Creates object to match label text with value
//     var topics = {};
//     topics = {
//         "Average Overall Review": "avg_review_overall",
//         "Average Appearance Review": "avg_review_appearance",
//         "Average Palate Review": "avg_review_palate",
//         "Average Taste Review": "avg_review_taste",
//         "Average Aroma Review": "avg_review_aroma",
//         "Total Reviews": "total_reviews"
//     }

//     // Sets value
//     var value = topics[label];

//     // Creates arrays to use for data
//     var style_categories = [];
//     data.forEach(item => {style_categories.push(item.main_style)});
//     console.log(style_categories);

//     var style_values = [];
//     data.forEach(style_category => {
//         style_values.push(style_category[value])
//     })

//     // Sets data to be used in plotly
//     var trace1 = {
//         x: style_categories,
//         y: style_values,
//         type: 'bar',
//         name: 'Style Category',
//         marker: {
//             color: '#5ac47c'
//         },
//         fillcolor: '#5ac47c'
//     };

//     var data0 = [trace1];

//     // Sets layout for map
//     var layout = {
//         responsive: true,
//         autosize: true,
//         title: `Style Categories: ${label}`,
//         paper_bgcolor: '#ffffff',
//         plot_bgcolor: '#ffffff',
//         font: {
//             color: '#cccccc'
//         }
//     };

//     // Plots box plot
//     Plotly.newPlot("MainStyles", data0, layout);
// }

// function createCategoryBubbleChart(data, label) {

//     data.forEach(item => {console.log(item.main_style)});
//     // Creates object to match label text with value
//     var topics = {};
//     topics = {
//         "Average Overall Review": "avg_review_overall",
//         "Average Appearance Review": "avg_review_appearance",
//         "Average Palate Review": "avg_review_palate",
//         "Average Taste Review": "avg_review_taste",
//         "Average Aroma Review": "avg_review_aroma",
//         "Total Reviews": "total_reviews"
//     }

//     // Sets value
//     var value = topics[label];

//     // Creates arrays to use for data
//     var style_categories = [];
//     data.forEach(item => {style_categories.push(item.main_style)});
//     console.log(style_categories);

//     style_values = [];
//     style_count = [];
//     data.forEach(style_category => {
//         style_values.push(style_category[value]);
//         style_count.push(style_category['total_reviews']);
//     })

//     // Sets data to be used in plotly
//     var trace1 = {
//         x: style_values,
//         y: style_count,
//         // type: 'scatter',
//         mode: 'markers',
//         marker: {
//             size: 36 ,
//             color: '#5ac47c'
//         },
//         // fillcolor: '#5ac47c',
//         text: style_categories
//     };

//     var data0 = [trace1];

//     // Sets layout for map
//     var layout = {
//         responsive: true,
//         autosize: true,
//         title: `Style Categories: ${label}`,
//         paper_bgcolor: '#ffffff',
//         plot_bgcolor: '#ffffff',
//         font: {
//             color: '#cccccc'
//         }
//     };

//     // Plots box plot
//     Plotly.newPlot("MainStyles", data0, layout);

// }

// function plotRadarChart(data, label) {

//     var topics = {};
//     topics = {
//         "Average Overall Review": "avg_review_overall",
//         "Average Appearance Review": "avg_review_appearance",
//         "Average Palate Review": "avg_review_palate",
//         "Average Taste Review": "avg_review_taste",
//         "Average Aroma Review": "avg_review_aroma",
//         "Total Reviews": "total_reviews"
//     }

//     // Sets value
//     var value = topics[label];
        
//     options = {
//         series: [
//         //   {
//         //     name: "Radar Series 1",
//         //     data: [45, 52, 38, 24, 33, 10]
//         //   },
//           {
//             name: "Average Ratings by Beer Style",
//             data: [26, 21, 20, 6, 8, 15]
//           }
//         ],
//         labels: ['April', 'May', 'June', 'July', 'August', 'September'],
//         plotOptions: {
//             radar: {
//               size: undefined,
//               offsetX: 0,
//               offsetY: 0,
//               polygons: {
//                 strokeColors: '#5ac47c',
//                 connectorColors: '#5ac47c',
//                 fill: {
//                     opacity: 0.5,
//                     colors: '#5ac47c'
//                 }
//               }
//             }
//     }
//     }
// }

// Changes names of autocomplete inputs
function runModel() { 
    d3.select("#beer_1 input").attr("name", "beer1");
    d3.select("#beer_2 input").attr("name", "beer2");
    d3.select("#beer_3 input").attr("name", "beer3");
    }
    d3.select("#my-form").on("submit", function () {
        d3.event.preventDefault();
        runModel();
        this.submit();
});

function createStyleBarChart(style_data) {

    var sorted_styles = Object.entries(style_data).sort(function (a, b) { return +b[1].total - +a[1].total });
    console.log(sorted_styles);
    var totals = [];
    Object.values(style_data).forEach(style => {
        // console.log(style.total);
        totals.push(+style.total);
    })
    console.log(totals);

    var sheight = 500;
    var swidth = 800;

    var xLinearScale = d3.scaleLinear().domain([0, 14]).range([60, swidth - 100]);
    var yLinearScale = d3.scaleLinear().domain([0, d3.max(totals)]).range([400, 30]);

    var barWidth = xLinearScale(0.5) - 55;
    var barSpace = barWidth * 0.1;
    var container = d3.select('#MainStyles').append('svg').attr('height', sheight).attr('width', swidth);

    // container.append('g').selectAll('rect').data(sorted_styles).enter().append('rect')
    //     .attr('height', d => sheight - yLinearScale(+d[1].total) - 100).attr('width', barWidth)
    //     .attr('x', (d, i) => xLinearScale(i)).style('fill', '#5ac47c')
    //     .attr('transform', d => `translate(0,${yLinearScale(d[1].total)})`);
    
    // var colors = ['#ee2378', '#6ab27c', '#ee2378', '#7ba07b', '#de3578', '#8c8e7a', '#ce4778', '#9c7c7a', '#bd5979', '#ac6a7a', '#5ac47c', '#FF1177'];
    
    var colors = ['#FF1177', '#de3578', '#b56279', '#8c8e7a', '#6ab27c', '#9c7c7a', '#bd5979', '#ee2378', '#ce4778', '#ac6a7a', '#7ba07b', '#5ac47c', '#a4737a'];

    sorted_styles.forEach((styleset, i) => {

        console.log(styleset[1].sub_styles);
        var maxs = Object.entries(styleset[1].sub_styles).length;
        // console.log(Object.entries(styleset)[1][1].sub_styles);
        var subs = Object.entries(styleset[1].sub_styles);
        // console.log(Object.entries(styleset[1].sub_styles)[0][1].total);
        var colorscale = d3.scaleLinear().domain([0, maxs]).range(['#FF1177', '#5ac47c']);
        // console.log(colorscale(Object.entries(styleset[1].sub_styles)[0][1].total));
        var new_colors = colors.slice(0, maxs);

        console.log(Object.values(subs));
        container.append('g').selectAll('rect').data(Object.values(subs)).enter().append('rect')
            .attr('height', d => sheight - yLinearScale(+d[1].total) - 100).attr('width', barWidth)
            .attr('x', xLinearScale(i)).style('fill', (d, n) => new_colors[n])
            .attr('transform', d => `translate(0,${yLinearScale(+d[1].total + +d[1].y)})`)
            .classed('sub_rects', true);
        })
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = container.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${sheight - 100})`)
        .call(bottomAxis);
    var yAxis = container.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(60, 0)`)
        .call(leftAxis);    
    
    var labelsGroup = container.append("g")

    // Creates x axis label
    labelsGroup.append("text")
        .attr("transform", `translate(${(swidth / 2) - 15}, ${sheight - 70})`)
        .attr("x", -50)
        .attr("y", 20)
        .text('Beer Style')
        .style('font-weight', 'bold');
    
    // Creates y axis label
    labelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -(sheight/4) * 2.3 )
        .attr("y", 10)
        .style('font-weight', 'bold')
        .text("Total Beers");
    
    // Creates title
    labelsGroup.append("text")
        .attr("transform", `translate(${(swidth / 2) - 15}, ${5})`)
        .attr("x", -50)
        .attr("y", 20)
        .text('Beer Style Distribution')
        .style('font-size', '1rem')
        .style('font-weight', 'bold');
    
    d3.selectAll('.x-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.y-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.tick').selectAll('line').style('stroke', 'lightgray');
    d3.selectAll('.x-axis .tick').selectAll('line').style('stroke', 'transparent');

    var tcklbls = d3.selectAll('.x-axis').selectAll('.tick').selectAll('text').nodes();
    // console.log(tcklbls[(tcklbls.length - 1)]);
    d3.select(tcklbls[(tcklbls.length - 1)]).text('');

    tcklbls.slice(0,14).forEach((node, i) => {
        // console.log(node);
        d3.select(node).text(splitStyle(sorted_styles[i][0])).style('font-size', '0.55rem').style('text-anchor', 'middle').attr('transform', `translate(13, ${i % 2 * 10})`);
    })

    d3.selectAll('.sub_rects');
    console.log(d3.selectAll('.sub_rects').nodes());
    hoverBar(d3.selectAll('.sub_rects'));


}

// Creates total beer distribution bar chart
function createAvgBarChart() {
    var style_data = {};

    // var total_beers = [350, 444, 430, 504, 145, 964, 2227, 1261, 463, 731, 806, 1027, 720, 214];
    var total_beers = [2227, 1261, 1027, 964, 806, 731, 720, 504, 444, 430, 463, 350, 214, 145];

    // var abv_avg = [173, 213, 190, 323, 60, 462, 987, 558, 211, 318, 375, 470, 319, 100];
    var abv_avg = [987, 558, 470, 462, 375, 318, 319, 323, 213, 190, 211, 173, 100, 60];

    // var total_reviews = [50610, 48899, 60821, 60925, 15775, 210717, 208731, 116531, 67373, 83381, 166797, 207116, 86224, 32378];
    var total_reviews = [208731, 116531, 207116, 210717, 166797, 83381, 86224, 60925, 48899, 60821, 67373, 50610, 32378, 15775];

    // var set_styles = ['Bocks', 'Brown Ales', 'Dark Ales', 'Dark Lagers', 'Hybrid Beers', 'India Pale Ales', 'Pale Ales', 'Pilseners and Pale Lagers', 'Porters', 'Specialty Beers', 'Stouts', 'Strong Ales', 'Wheat Beers', 'Wild/Sour Beers'];
    var set_styles = ['Pale Ales', 'Pilseners and Pale Lagers', 'Strong Ales', 'India Pale Ales', 'Stouts', 'Specialty Beers', 'Wheat Beers', 'Dark Lagers', 'Brown Ales', 'Dark Ales', 'Porters', 'Bocks', 'Wild/Sour Beers', 'Hybrid Beers'];

    set_styles.forEach((d, i) => {
        style_data[d] = { 'total_beers': total_beers[i], 'above_average': abv_avg[i], 'total_reviews': total_reviews[i] };
    })

    var sheight = 500;
    var swidth = 800;

    // var xLinearScale = d3.scaleLinear().domain([0, 14]).range([60, swidth - 50]);
    var xLinearScale = d3.scaleLinear().domain([0, 14]).range([60, swidth - 100]);
    var yLinearScale = d3.scaleLinear().domain([0, d3.max(total_beers)]).range([sheight - 50, 30]);

    var barWidth = xLinearScale(0.25) - 55;
    var barSpace = barWidth * 0.1;
    var container = d3.select('#MainStyles').append('svg').attr('height', sheight).attr('width', swidth);

    container.append('g').selectAll('rect').data(Object.entries(style_data)).enter().append('rect')
        .attr('height', d => sheight - yLinearScale(d[1].total_beers) - 50).attr('width', barWidth)
        .attr('x', (d, i) => xLinearScale(i)).style('fill', '#5ac47c')
        .attr('transform', d => `translate(0,${yLinearScale(d[1].total_beers)})`);
    
    container.append('g').selectAll('rect').data(Object.entries(style_data)).enter().append('rect')
        .attr('height', d => (sheight - yLinearScale(d[1].above_average)) - 50).attr('width', barWidth)
        .attr('x', (d, i) => xLinearScale(i)).style('fill', '#FF1177')
        .attr('transform', d => `translate(0,${yLinearScale(d[1].above_average)})`);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = container.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${sheight - 50})`)
        .call(bottomAxis);
    var yAxis = container.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(60, 0)`)
        .call(leftAxis);    
    
    var labelsGroup = container.append("g")

    // Creates x axis label
    labelsGroup.append("text")
        .attr("transform", `translate(${(swidth / 2) - 15}, ${sheight - 30})`)
        .attr("x", -50)
        .attr("y", 20)
        .text('Beer Style')
        .style('font-weight', 'bold');
    
    // Creates y axis label
    labelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -(sheight/4) * 2.3 )
        .attr("y", 10)
        .style('font-weight', 'bold')
        .text("Total Beers");
    
    d3.selectAll('.x-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.y-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.tick').selectAll('line').style('stroke', 'lightgray');
    d3.selectAll('.x-axis .tick').selectAll('line').style('stroke', 'transparent');

    var tcklbls = d3.selectAll('.x-axis').selectAll('.tick').selectAll('text').nodes();
    console.log(tcklbls[(tcklbls.length - 1)]);
    d3.select(tcklbls[(tcklbls.length - 1)]).text('');

    tcklbls.slice(0,14).forEach((node, i) => {
        console.log(node);
        d3.select(node).text(splitStyle(set_styles[i])).style('font-size', '0.55rem').attr('transform', `translate(8, ${i % 2 * 10})`);
    })
    
    drawColorScale(container);

}

//  
d3.csv('./static/Files/full_style_count.csv', function (data) {

    console.log(data);

    var style_data = {};
    // var sub_style = {};
    // var style_stats = {}

    data.forEach(row => {

        style_data[row.main_style] = {};

    })

    Object.keys(style_data).forEach(style => {
        var style_stats = {};
        var sub_stats = {};

        data.forEach(row => {

            if (row.main_style == style) {
                style_stats[row.beer_style] = {};
                style_stats[row.beer_style]['total'] = row.sub_style_full_count;;
                style_data[style]['total'] = row.main_style_full_count;  
            }
            style_data[style]['sub_styles'] = style_stats;
        })

    })

    Object.entries(style_data).forEach(style => {

        var y_count = 0;
        Object.entries(style[1].sub_styles).forEach(sub => {

            console.log([sub[1]][0].total);
            style_data[style[0]].sub_styles[sub[0]]['y'] = y_count;
            y_count = y_count + +[sub[1]][0].total;

        })

    })

    console.log(style_data);

    var sheight = 900;
    var swidth = 250;
    var container = d3.select('#top');

    var y_count = 0;

    createStyleBarChart(style_data);

})

// Tooltips for bar chart
function hoverBar(objs) {

    var toolTip = d3.tip()
        .attr("class", "d3-tip_bubble")
        .offset([-10, 75])
        .html(function (d) {
            return (`${d[0]}: ${d[1].total}`);
        });

    objs.call(toolTip);

    objs.on("mouseover", function (labels) {
        toolTip.show(labels, this);
        d3.select(this).style("stroke", "white").style('fill-opacity', 1);
        d3.event.stopPropagation();
    }).on("mouseout", function (labels) {
        toolTip.hide(labels);
        d3.select(this).style("stroke", "transparent").style('fill-opacity', 0.9);
    });
}

// Function to split strings containing 'and'
function splitStyle(string) {
    var newString = string.split(' and ').join('/');
    return newString;
}

// Creates color legend
function drawColorScale(svg) {
    var pallete = svg.append('g')
        .attr('id', 'pallete')
    var swatch = pallete.selectAll('rect')
        .data(['#5ac47c', '#FF1177'])
        .attr('width', 20)
        .attr('height', 20);
    
    console.log(svg.nodes()[0].attributes.width.value);
    var width = svg.nodes()[0].attributes.width.value;
    var height = svg.nodes()[0].attributes.height.value;

    swatch.enter().append('rect')
        .attr('fill', d => d)
        .attr('x', (d, i) => (width - 170))
        .attr('y', (d, i) => (i * 25))
        .attr('width', 20)
        .attr('height', 20)
        .attr("transform", `translate(${20}, ${height / 2 - 220})`);

    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'end').style('opacity', 0.6).style('font-size', '10px').style('fill', '#c9c9c9').attr("transform", `translate(${width - 170 + 10}, ${height / 2 - 200 - 5})`).html('Total Beers');
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'end').style('opacity', 0.6).style('font-size', '10px').style('fill', '#c9c9c9').attr("transform", `translate(${width - 170 + 10}, ${height / 2 - 192 + 10})`).html('Total Above Average');
}

// Calls initial function
var chosenBeers = d3.selectAll('input').values;
console.log(d3.selectAll('input').values);
init();