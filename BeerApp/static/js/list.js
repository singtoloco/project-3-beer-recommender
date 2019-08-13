// Calls prediction defined in flask and list.html
var prediction = prediction;
var chosenBeer1 = beer1;
var chosenBeer2 = beer2;
var chosenBeer3 = beer3;
var chosenBeers = [beer1, beer2, beer3];
console.log(chosenBeer1, chosenBeer2, chosenBeer3);

d3.json('/run', function (data) {
    console.log(data);
    d3.select('.chosen').classed('vis', false).classed('hid', true);

    var clusters = {}
    for (var i = 0; i < 30; i++) {
        stats = {}
        clusters[i] = stats;
    }
    
    // Format data to be used
    for (var i = 0; i < 30; i++) {
        var beers = {};
        var styles = {};
        data.forEach(indx => {
            var stats = {};
            
            if (indx.beer_name == chosenBeers[0] || indx.beer_name == chosenBeers[1] || indx.beer_name == chosenBeers[2]) {
                console.log('nope');
            }
            else {
                if (indx.cluster == i) {
                    var style_stats = {};
                    var group_stats = {};
                    var beer_ratings = {};

                    beer_ratings['group_overall'] = indx.avg_review_overall_p_beer_p_style_p_group;
                    beer_ratings['group_taste'] = indx.avg_review_taste_p_beer_p_style_p_group;
                    beer_ratings['group_palate'] = indx.avg_review_palate_p_beer_p_style_p_group;
                    beer_ratings['group_aroma'] = indx.avg_review_aroma_p_beer_p_style_p_group;
                    beer_ratings['group_appearance'] = indx.avg_review_appearance_p_beer_p_style_p_group;

                    stats['brewery'] = indx.brewery_name;
                    stats['abv'] = indx.beer_abv;
                    stats['main_style'] = indx.main_style;
                    stats['beer_style'] = indx.beer_style;
                    stats['ratings'] = beer_ratings;
                    stats['image_url'] = indx.image_url;
                    stats['total_per_cluster'] = indx.total_reviews_per_beer_per_style_by_cluster;
                    stats['total_overall'] = indx.full_total_beers;
                    beers[indx.beer_name] = stats;

                    style_stats['group_overall'] = indx.avg_review_overall_p_style_p_group;
                    style_stats['group_taste'] = indx.avg_review_taste_p_style_p_group;
                    style_stats['group_palate'] = indx.avg_review_palate_p_style_p_group;
                    style_stats['group_aroma'] = indx.avg_review_aroma_p_style_p_group;
                    style_stats['group_appearance'] = indx.avg_review_appearance_p_style_p_group;
                    style_stats['total_per_cluster'] = indx.total_reviews_per_style_by_cluster;
                    style_stats['total_overall'] = indx.full_total_styles;
                    style_stats['main_style_cluster_count'] = indx.main_style_cluster_count;
                    styles[indx.main_style] = style_stats;

                    group_stats['avg_overall'] = indx.review_overall_per_group_full;
                    group_stats['avg_taste'] = indx.review_taste_per_group_full;
                    group_stats['avg_palate'] = indx.review_palate_per_group_full;
                    group_stats['avg_aroma'] = indx.review_aroma_per_group_full;
                    group_stats['avg_appearance'] = indx.review_appearance_per_group_full;
                    group_stats['total_per_cluster'] = indx.full_total_groups;

                    clusters[i]['styles'] = styles;
                    clusters[i]['beers'] = beers;
                    clusters[i]['group_stats'] = group_stats;
                }
            }
        })
    }
    console.log(clusters);

    notation();

    // Sorts top beers by overall review, number of reviews and taste reviews
    var sorted_beers = Object.entries(clusters[prediction].beers).sort(function (a, b) { return +b[1].ratings.group_overall - +a[1].ratings.group_overall ||  +b[1].ratings.total_overall - +a[1].ratings.total_overall || +b[1].ratings.group_taste - +a[1].ratings.group_taste || +b[1].ratings.group_palate - +a[1].ratings.group_palate || +b[1].ratings.group_appearance - +a[1].ratings.group_appearance || +b[1].ratings.group_aroma - +a[1].ratings.group_aroma || +b[1].abv - +a[1].abv});

    // var sorted_beers = Object.entries(beers).sort(function (a, b) { return +b[1].ratings.group_overall - +a[1].ratings.group_overall; });
    var top_beers = sorted_beers.slice(0, 25);

    // Creates cluster notificaton at top
    var clusterid = d3.select('#ratings1')
        .append('svg').attr('height', '60%').attr('width', '100%')
        .append('g').selectAll('rect')
        .data([prediction]).enter().append('rect').classed('card rounded clusterid', true)
        .attr('height', '100%').attr('width', '100%').attr('fill', 'transparent')
        .attr('stroke', 'white').attr('border-radius', '3%');
    
    clusterid.select('rect').append('g').data([prediction]).enter()
        .append('text')
        .attr('y', '30%')
        .attr('x', '50%')
        .text('Cluster:')
        .attr('text-anchor', 'middle')
        .style('font-size', '2rem')
        .style('font-weight', 'lighter')
        .classed('titles', true)
        .style('fill', 'black');
    
    clusterid.select('rect').append('g').data([prediction]).enter()
        .append('text')
        .attr('y', '75%')
        .attr('x', '50%')
        .text(d => +d + 1)
        .attr('text-anchor', 'middle')
        .style('font-size', '6rem')
        .style('font-style', 'bolder')
        .classed('titles', true)
        .style('fill', 'black');

    // Creates recommendation list item cards
    var rect_group = d3.select('#list').selectAll('.card').append('div')
        .classed('col-3', true)
        .classed('list_item_div', true).data(Object.values(top_beers)).enter()
        .append('div')
        .classed('card rounded', true)
        .classed('border-1', true)
        .attr('width', '100%').attr('height', '90%')
        .attr('y', (d, i) => `${(i * 11)}%`)
        .attr('x', 0)
        .classed('list_item', true).style('background-color', '#f4f0f0')
        .style('margin-top', '3%');
    
    // Creates beer titles
    rect_group.nodes().forEach((rect, i) => {
        d3.select(rect).append('card-head').selectAll('text')
            .data([Object.values(top_beers)[i]]).enter()
            .append('text')
            .text(Object.values(top_beers)[i][0])
            .attr('text-anchor', 'left')
            .style('font-size', '1.5rem')
            .style('font-weight', 'bolder')
            .classed('titles', true)
            .style('color', 'black')
            .style('background-color', 'transparent')
            .style('padding-top', 5)
            .style('padding-left', '3%')
            .style('padding-bottom', 5);
        })
    
    // Adds row to each card in order to keep elements in-line
    var list_divs = d3.selectAll('.list_item');
    list_divs.nodes().forEach(item => {
        d3.select(item).append('div').classed('row', true);
    })
    
    // Creates divs for each element on each list item
    var divs = [['thumb',2], ['table',4], ['radar',4], ['rate',2]];
    d3.select('#list').selectAll('.row').nodes().forEach(row => {
        d3.select(row).selectAll('div').data(divs).enter().append('div').attr('id', d => `${d[0]}`)
            .attr('class', d => `col-${d[1]}`);
    })
    
    // Adds images to list items
    d3.select('#list').selectAll('.row').select('#thumb').nodes().forEach((rect, i) => {
        d3.select(rect).append('svg')
            .attr('width', '100%')
            .attr('stroke-color', 'black')
            .attr('stroke', 1)
            .append("image")
            .classed('img_holder', true)
            .attr('width', '100%').attr('height', '100%')
            .attr("xlink:href", `${Object.values(top_beers)[i][1].image_url}`)
            .attr('y', 6)
            .attr('x', 0)
            .classed('thumbnails', true);

        })

    // Creates radar chart divs
    d3.selectAll('#radar').nodes().forEach((rect, i) => {
        d3.select(rect).selectAll('div')
            .data([Object.values(top_beers)[i]]).enter()
            .append('div')
            .attr('y', 0)
            .attr('x', '65%')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('id', ('MyChart' + i))
            .classed('radarchart', true);
    })

    var radarCharts = d3.selectAll('.radarchart');

    // Calls function to plot radar charts for each beer
    Object.values(top_beers).forEach((beer, i) => {
        plotRadarChart(beer[1], i);
    })
    
    // Creates rating label
    d3.selectAll('#rate').nodes().forEach((rect, i) => {
        var crd = d3.select(rect).append('div').classed('card rating_card border-0', true)
            .style('background-color', 'transparent');
        crd.append('text').text(`Average Rating`)
            .attr('text-anchor', 'middle')
            .classed('avg_title', true)
            .style('color', '#a5a5a5')
            .style('text-align', 'center');
        crd.append('div').classed('card-body rating_card_b border-0', true).style('background-color', 'transparent')
            .text(Object.values(top_beers)[i][1].ratings.group_overall)
            .attr('text-anchor', 'middle')
            .style('font-weight', 400)
            .classed('avg_rating', true)
            .style('color', '#5ac47c');
    })
        
    // Adds beer Ratings
    d3.selectAll('#rate').nodes().forEach((rect, i) => {
        d3.select(rect).selectAll('text')
            .data([Object.values(top_beers)[i]]).enter()
            .append('text')
            .text(Object.values(top_beers)[i][1].ratings.group_overall)
            .attr('text-anchor', 'middle')
            .style('font-weight', 600)
            .classed('avg_rating', true)
            .style('color', '#5ac47c');
    })

    // Formats the poltly radar charts
    d3.selectAll('.js-fill').style('opacity', 0.8);
    d3.selectAll('.plotbg').selectAll('path').style('fill', '#f2f2f2');
    d3.selectAll('.xgrid').style('stroke-opacity', 0.45);
    d3.selectAll('.angular-line').selectAll('path').style('opacity', 0.6);
    d3.selectAll('.xtick .ticks').selectAll('path').style('opacity', 0.6);
    d3.selectAll('.xtick').selectAll('text').style('opacity', 0.6);

    // Adds beer stats table for each beer
    var summaries = [['Brewery: ', 'brewery'], ['Style: ', 'main_style'], ['Sub-style: ', 'beer_style'], ['Alochol By Volume (AVB): ', 'abv']];
    d3.selectAll('#table').nodes().forEach((rect, i) => {
        var pnl = d3.select(rect).append('div')
            .classed("card", true).classed('border-0', true).classed('table_card', true)
            .append('div').classed("card-body", true);
        var tbl = pnl.append('table');

        summaries.forEach(data_value => {
            tbl.append('tbody')
                .selectAll("tr").data([data_value])
                .enter().append("tr")
                .html(`<th class="sum_th">${data_value[0]}</th><td class='sum_td'>${Object.values(top_beers)[i][1][data_value[1]]}</td>`);
        })
    })

    // d3.select('.chosen').classed('vis', false).classed('hid', true);

    // Calls scatter plot function
    chooseScatterValue(clusters[prediction])
    var legend_container = d3.select('#legend').append('svg').attr('height', 300).attr('width', 180).append('g');
    drawColorScale2(legend_container);
    showChoices();
})

function showChoices() {
    console.log(chosenBeers);

    var listedBeers = [];
    chosenBeers.forEach(beer => {    
        if (beer == 'null') {
            console.log('nope')
        }
        else {
            listedBeers.push(beer)
        }
    })
    newlistedBeers = [...new Set(listedBeers)];
    var colsize = 12 / newlistedBeers.length;
    console.log(colsize);
    if (newlistedBeers.length == 0) {
        d3.select('.chosen').classed('vis', false).classed('hid', true).style('margin-top', '-3%');
    }
    else {
        d3.select('.chosen').classed('vis', true).classed('hid', false);
    }
    
    var container = d3.select('.listChosen').append('div')
        .classed('row', true).selectAll('div').data(newlistedBeers).enter()
        .append('div')
        .classed('option', true)
        .classed(`col-${colsize}`, true)
        .append('div')
        .classed('card border-1', true)
        .style('background-color', '#f4f0f0')
        .style('text-align', 'center')
        .style('margin-top', '1rem')
        .html(d => `<h4 class='choice'>${d}</h4>`);

    
    // var container = d3.select('.listChosen').data(chosenBeers).append('div').classed('option', true);
}

// Function to create radar charts
function plotRadarChart(data, i) {
    mydata = [{
        type: 'scatterpolar',
        r: [data.ratings.group_taste, data.ratings.group_palate, data.ratings.group_aroma, data.ratings.group_appearance, Math.min(data.abv*5/10, 5)],
        theta: ['Taste', 'Palate', 'Aroma', 'Appearance', 'ABV(%)'],
        fill: 'toself',
        fillcolor: '#5ac47c',
        line: {
            color: '#5ac47c'
        }
    }]
    layout = {
        width: 300,
        height: 200,
        margin: {
            l: 60,
            r: 60,
            b: 30,
            t: 30,
            pad: 0
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: {
            size: 10,
            color: 'dimgray'
        },        
        polar: {
            angularaxis: {
                direction: "clockwise",
                period: 5
            },
            radialaxis: {
                visible: true,
                range: [0, 5]
            }
        },
        showlegend: false
    }
    Plotly.plot(`MyChart${i}`, mydata, layout, {displayModeBar: false})
}

function chooseScatterValue(data) {

    // var chosenText = "Population";
    var btns = d3.selectAll('.scatterbtn');
    createScatter(data, "Overall");

    btns.on("click", function () {

        console.log(this);

        d3.selectAll('.d3-tip_bubble').remove();
        var drdnText = d3.select(".scatterbtngr").text();
        chosenText = d3.select(this).text();

        if (chosenText != drdnText) {
            d3.select("#ratings2").html("");

            d3.select(".scatterbtngr").html(chosenText);
            d3.select(this).classed('inactiveDropDown', true).classed('activeDropDown', false);

            createScatter(data, chosenText);
        }

        btns.nodes().forEach((button, i) => {
            var text = d3.select(button).text();
            if (text === drdnText) {
                d3.select(button).classed('inactiveDropDown', false).classed('activeDropDown', true);
            }
        })
    });
}

// Function to create scatter plot
function createScatter(data, chosenValue) {

    var labels = { 'Overall': 'overall', 'Taste': 'taste', 'Palate': 'palate', 'Appearance': 'appearance', 'Aroma': 'aroma' };
    var value = labels[chosenValue];

    var total_reviews = 1416278;
    var set_styles = ['Bocks', 'Brown Ales', 'Dark Ales', 'Dark Lagers', 'Hybrid Beers', 'India Pale Ales', 'Pale Ales', 'Pilseners and Pale Lagers', 'Porters', 'Specialty Beers', 'Stouts', 'Strong Ales', 'Wheat Beers', 'Wild/Sour Beers'];

    // Selects container to append
    var svg = d3.select('#ratings2').append('svg').attr('width', '100%').attr('height', '100%');
    var swidth = d3.select('#ratings2').select('svg').nodes()[0].clientWidth;
    var sheight = d3.select('#ratings2').select('svg').nodes()[0].clientHeight;

    // Scales to be used for plot
    var sizeScale = d3.scaleLinear().domain([0, 100]).range([0, 40]);
    var xLinearScale = d3.scaleLinear()
        .domain([0,13])
        .range([50, swidth - 100]);
    var zScale = d3.scaleSqrt()
        .domain([0,100])
        .range([0, 10]);
    var yLinearScale = d3.scaleLinear()
        .domain([0,5])
        .range([sheight - 40, 70]);
    
    // Creates scatter plot axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xAxis = svg.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${sheight - 50})`)
        .call(bottomAxis);
    var yAxis = svg.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(50, -20)`)
        .call(leftAxis);
    
    console.log(data);
    var total_by_style = [339, 416, 390, 476, 133, 914, 2120, 1228, 448, 684, 786, 947, 685, 202];
    var averages = [[3.86, 3.83, 3.83, 3.73, 3.78, 3.97, 3.83, 3.36, 3.91, 3.58, 3.97, 3.92, 3.82, 4.06],
        [3.89, 3.78, 3.84, 3.61, 3.69, 3.99, 3.72, 3.11, 3.92, 3.6, 4.05, 4.03, 3.67, 4.12],
        [3.79, 3.63, 3.8, 3.48, 3.6, 3.97, 3.65, 3.95, 3.85, 3.66, 3.97, 3.98, 3.63, 4.09],
        [3.87, 3.82, 3.95, 3.72, 3.78, 4.01, 3.81, 3.2, 3.97, 3.66, 4.12, 4, 3.72, 4.01],
        [3.83, 3.69, 3.78, 3.57, 3.71, 3.93, 3.69, 3.15, 3.81, 3.56, 3.96, 3.96, 3.65, 4.01]];
    
    var totals = {};
    set_styles.forEach((d, i) => {
        totals[d] = { 'style_total': +total_by_style[i], 'overall_total': 9768, 'overall': averages[0][i], 'palate': averages[4][i], 'aroma': averages[2][i], 'appearance': averages[3][i], 'taste': averages[1][i] };
    })

    console.log(totals);
    // 
    var style_values = {};
    set_styles.forEach((style, i) => {
        var value_list = {};
        if (data.styles[style]) {
            value_list['overall'] = data.styles[style].group_overall;
            value_list['taste'] = data.styles[style].group_taste;
            value_list['aroma'] = data.styles[style].group_aroma;
            value_list['appearance'] = data.styles[style].group_appearance;
            value_list['palate'] = data.styles[style].group_palate;
            value_list['total'] = +data.styles[style].main_style_cluster_count / total_by_style[i] * 100;
            value_list['all'] = totals[style];
        }
        else {
            value_list['overall'] = 0;
            value_list['taste'] = 0;
            value_list['aroma'] = 0;
            value_list['appearance'] = 0;
            value_list['palate'] = 0;
            value_list['total'] = 0;
            value_list['all'] = totals[style];
        }
        style_values[style] = value_list;
    })
    
    // Formats plotly radar plot
    console.log(d3.selectAll('.tick').selectAll('text'));
    d3.selectAll('.x-axis').selectAll('.tick').selectAll('text').nodes().forEach((node, i) => {
        d3.select(node).text(splitStyle(set_styles[i])).style('font-size', '0.55rem').attr('transform', `translate(0, ${i%2 * 15})`);
    })

    d3.selectAll('.x-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.y-axis').selectAll('path').style('stroke', 'lightgray');
    d3.selectAll('.tick').selectAll('line').style('stroke', 'lightgray');

    //  Full set circles
    var circleGroup2 = svg.append('g')
        .selectAll('circle')
        .data(Object.values(totals))
        .enter()
        .append("circle")
        .attr("cx", (d,i) => xLinearScale(i))
        .attr("cy", d => yLinearScale(d[value]))
        .attr("r", d => `${( sizeScale(+d.style_total/+d.overall_total * 100)) * 2}`)
        .style("stroke", "dimgray")
        .style('fill', 'dimgray')
        .style('fill-opacity', 0.5)
        .classed("beerOverallCircle", true);
    
    // Cluster circles
    var circleGroup1 = svg.append('g')
        .selectAll('circle')
        .data(Object.values(style_values))
        .enter()
        .append("circle")
        .attr("cx", (d,i) => xLinearScale(i))
        .attr("cy", d => yLinearScale(d[value]))
        .attr("r", d => `${( sizeScale(d.total))*2}`)
        .style("stroke", "#5ac47c")
        .style('fill', '#5ac47c')
        .style('fill-opacity', 0.5)
        .classed("beerCircle", true);
    
    var labelsGroup = svg.append("g");
    
    // Creates title
    labelsGroup.append("text")
        .attr("transform", `translate(${xLinearScale(7)}, 0)`)
        .attr("x", 0)
        .attr("y", 20)
        .attr('text-anchor', 'middle')
        .text('Style Distribution')
        .style('font-weight', 'bold');
    
    // Creates x axis label
    labelsGroup.append("text")
        .attr("transform", `translate(${(xLinearScale(7))}, ${sheight - 25})`)
        .attr("x", 0)
        .attr("y", 20)
        .style('font-size', '.8rem')
        .attr('text-anchor', 'middle')
        .text('Beer Style')
        .style('font-weight', 'bold');
    
    // Creates y axis label
    labelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -1 * yLinearScale(3))
        .attr('text-anchor', 'middle')
        .attr("y", 20)
        .style('font-size', '.8rem')
        .style('font-weight', 'bold')
        .text("Avg Rating");
    
    rollOver(circleGroup1, Object.values(totals), chosenValue, value);
}

// Roll over function for scatter
function rollOver(circleGroup, totals, label, value) {

    console.log(totals);

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([115, 115])
        .html(function (d, i) {
            return (`${label} Review (Cluster): ${d[value]}<br>Percentage (Cluster): ${(d.total).toFixed(2)}%<br>${label} Review (Full Set): ${d.all[value]}<br>Percentage (Full Set): ${(d.all.style_total/d.all.overall_total * 100).toFixed(2)}%`);
        });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function (labels) {
        toolTip.show(labels, this);
    })
        .on("mouseout", function (labels) {
            toolTip.hide(labels);
        });
    
}

// Function to split beer_style to reduce space for labels
function splitStyle(string) {
    var newString = string.split(' and ').join('/');
    return newString;
}

// Function to create color legends
function drawColorScale2(svg) {

    // console.log(svg);
    var pallete = svg.append('g')
        .attr('id', 'pallete');
    var swatch = pallete.selectAll('rect')
        .data(['#5ac47c', 'dimgray'])
        .attr('width', 20)
        .attr('height', 20);
    
    var width = svg.nodes()[0].parentElement.attributes.width.value.split('%')[0];
    var height = svg.nodes()[0].parentElement.attributes.height.value.split('%')[0];

    swatch.enter().append('circle')
        .attr('fill', d => d)
        .attr('cx', `${(10)}%`)
        .attr('cy', (d, i) => `${(i * 5)}%`)
        .attr('r', 5)
        .attr('fill-opacity', 0.5)
        .attr("transform", `translate(${0}, ${100})`);

    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'left').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').attr("transform", `translate(${50}, ${102})`).html('Cluster');
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'left').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').attr("transform", `translate(${50}, ${120})`).html('Full');
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'left').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').attr("transform", `translate(${20}, ${147})`).html('*size denotes % distribution')
}

// Function for scale notation
function notation() {
    d3.select('.recommendations').append('text').text("* ABV(%) is below radar charts is scaled as ABV/2")
        .style('color', '#b9b9b9').attr('text-anchor', 'middle').style('font-size', '0.75rem')
        .style('position', 'absolute').classed('rscaleNote', true);
}