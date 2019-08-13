d3.json('/top', function (data) {
    console.log( Object.values(data));

    var clusters = {}
    var style_clusters = {};
    for (var i = 0; i < 30; i++) {
        stats = {}
        clusters[i] = stats;
        var style_clusters = {};
    }
    
    for (var i = 0; i < 30; i++) {
        var beers = {};
        var styles = {};
        var main_styles = {};
        var sub_styles = {};

        data.forEach(indx => {
            var stats = {};
            
            if (indx.cluster == i) {
                var style_stats = {};
                var group_stats = {};
                var beer_ratings = {};
                var main_count = {};
                var sub_count = {};    

                main_count['total'] = indx.main_style_cluster_count;
                main_styles[indx.main_style] = main_count;
                style_clusters[i] = main_styles;

                beer_ratings['group_overall'] = indx.avg_review_overall_p_beer_p_style_p_group;
                beer_ratings['group_taste'] = indx.avg_review_taste_p_beer_p_style_p_group;
                beer_ratings['group_palate'] = indx.avg_review_palate_p_beer_p_style_p_group;
                beer_ratings['group_aroma'] = indx.avg_review_aroma_p_beer_p_style_p_group;
                beer_ratings['group_appearance'] = indx.avg_review_appearance_p_beer_p_style_p_group;
                beer_ratings['sub_style_cluster_count'] = indx.sub_style_cluster_count;


                stats['brewery'] = indx.brewery_name;
                stats['abv'] = indx.beer_abv;
                stats['main_style'] = indx.main_style;
                stats['beer_style'] = indx.beer_style;
                stats['ratings'] = beer_ratings;
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
                group_stats['total_users_per_cluster'] = indx.total_users_in_cluster;
      
                clusters[i]['styles'] = styles;
                clusters[i]['beers'] = beers;
                clusters[i]['group_stats'] = group_stats;
            }
        })
    }
    console.log(clusters);

    d3heatmap(Object.values(clusters), style_clusters);
    drawTable();
    d3.select('.pie').classed('vis', false).classed('hid', true);

    clearBubbles();

})

function d3heatmap(data, style_clusters) {

    var value = 'group_overall';
    var set_styles = ['Bocks', 'Brown Ales', 'Dark Ales', 'Dark Lagers', 'Hybrid Beers', 'India Pale Ales', 'Pale Ales', 'Pilseners and Pale Lagers', 'Porters', 'Specialty Beers', 'Stouts', 'Strong Ales', 'Wheat Beers', 'Wild/Sour Beers'];
    var xlabels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
    var zaps = [], zas = [], zps = [], zts = [], zos = [], zss = [];
    var beers = [];
    
    // drawBoxes2(data, set_styles, style_clusters);
    var legend_container = d3.select('#hm_legend').append('svg').attr('height', '90%').attr('width', '90%')
        .append('g');
    
    chooseHeatMapValue(data, set_styles, style_clusters);
    drawColorScale(legend_container);
    // createTreeMap(data);
    notation();

}

function rollOver() {

    var squares = d3.selectAll('.hmsquare');

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([90, 65])
        .html(function (d) {
            return (`${d.county[0]}, ${d.state[0]}<br>${xlabel} ${d[chosenXAxis][yrs[chosenYear]]}<br>${ylabel} ${d[chosenYAxis][yrs[chosenYear]]}`);
        });

    circleGroup.call(toolTip);

    circleGroup.on("mouseover", function (labels) {
        toolTip.show(labels, this);
    })
        .on("mouseout", function (labels) {
            toolTip.hide(labels);
        });
}

function chooseHeatMapValue(data, set_styles, style_clusters) {

    var btns = d3.selectAll('.hmbtn');
    drawBoxes2(data, set_styles, style_clusters, "Overall");
    createTreeMap(data, "Overall");

    btns.on("click", function () {

        console.log(this);

        d3.selectAll('.d3-tip_bubble').remove();
        var drdnText = d3.select(".hmbtngr").text();
        chosenText = d3.select(this).text();

        if (chosenText != drdnText) {
            d3.select("#hm").html("");
            d3.select("#tree").select('.treediv').remove();

            d3.select(".hmbtngr").html(chosenText);
            d3.select(this).classed('inactiveDropDown', true).classed('activeDropDown', false);

            drawBoxes2(data, set_styles, style_clusters, chosenText);
            createTreeMap(data, chosenText);
        }

        btns.nodes().forEach((button, i) => {
            var text = d3.select(button).text();
            if (text === drdnText) {
                d3.select(button).classed('inactiveDropDown', false).classed('activeDropDown', true);
            }
        })
    });
}

function drawBoxes2(data, set_styles, style_clusters, chosenText) {

    var labels = { 'Overall': 'overall', 'Taste': 'taste', 'Palate': 'palate', 'Appearance': 'appearance', 'Aroma': 'aroma' };
    var value = labels[chosenText];

    var cluster_dict = {};
    Object.values(data).forEach((cluster, i) => {

        var style_dict = {};
        set_styles.forEach(style => {
            var rating_dict = {};

            if (cluster.styles[style]) {
                rating_dict['overall'] = cluster.styles[style].group_overall;
                rating_dict['taste'] = cluster.styles[style].group_taste;
                rating_dict['aroma'] = cluster.styles[style].group_aroma;
                rating_dict['appearance'] = cluster.styles[style].group_appearance;
                rating_dict['palate'] = cluster.styles[style].group_palate;
            }

            else {
                rating_dict['overall'] = null;
                rating_dict['taste'] = null;
                rating_dict['aroma'] = null;
                rating_dict['appearance'] = null;
                rating_dict['palate'] = null;
            }

            style_dict[style] = rating_dict;
        })

        cluster_dict[i] = style_dict;
    })

    // Create svg container for heatmap blocks
    if (window.matchMedia("(max-width: 992px)").matches) {
        var container = d3.select('#hm').append('svg')
            .attr('width', '105%').attr('height', '100%').append('g');
    }
    else {
        var container = d3.select('#hm').append('svg')
        .attr('width', '110%').attr('height', '100%').append('g'); 
    }
    
    var block_container = container.append('svg').attr('height', '95%')
        .attr('width', `95%`)
        .attr("x", `5%`)
        .attr("y", `5%`);
    
    // Define height, width, scales
    var swidth = d3.select('#hm').select('svg').nodes()[0].clientWidth;
    var sheight = d3.select('#hm').select('svg').nodes()[0].clientHeight;

    var xLinearScale = d3.scaleLinear()
        .domain([0,13])
        .range([50, swidth - 100]);
    var yLinearScale = d3.scaleLinear()
        .domain([0,29])
        .range([sheight - 70, 70]);
    
    var scaledWidth = xLinearScale(2) - xLinearScale(1);
    var scaledHeight = yLinearScale(1) - yLinearScale(2);
    
    var scale = d3.scaleLinear()
        .domain([0, 3.25, 5])
        .range(['#ffffff', '#5ac47c', '#FF1177']);

    // Create columns for each style
    set_styles.forEach((vset, n) => {
        container.append('g').selectAll("rect")
            .data(Object.entries(cluster_dict))
            .enter()
            .append("rect")
            .attr('height', scaledHeight)
            .attr('width', scaledWidth)
            .attr("x", (d, i) => xLinearScale(n))
            .attr("y", (d, i) => yLinearScale(i))
            .style('fill', d => scale(d[1][vset][value]))
            .style("stroke", d => scale(d[1][vset][value]))
            .classed("styleSquare", true)
            .classed(`${vset}`, true);
    })

    // Creates text labels for styles
    container.append('g').selectAll("rect")
        .data(set_styles)
        .enter()
        .append("text")
        .attr("x", (d, i) => xLinearScale(i) + 25)
        .attr("y", (d, i) => (i%2 * 20) + 40)
        .text(d => splitStyle(d))
        .attr('text-anchor', 'middle')
        .style('font-size', '0.65rem')
        .style('font-weight', 50)
        .style('fill', 'dimgray')
        .classed('style_names', true);

    // Creates cluster labels
    container.append('g').selectAll("rect")
        .data(Object.entries(cluster_dict))
        .enter()
        .append("text")
        .attr("x", 25)
        .attr("y", (d, i) =>  yLinearScale(i)+10)
        .text(d => +d[0] + 1)
        .attr('text-anchor', 'middle')
        .style('font-size', '0.65rem')
        .style('font-weight', 50)
        .style('fill', 'dimgray')
        .classed("cluster_names", true);
    

    var labelsGroup = container.append("g")

    // Creates x axis label
    labelsGroup.append("text")
        .attr("transform", `translate(${(swidth / 2) - 15}, 0)`)
        .attr("x", 0)
        .attr("y", 20)
        .text('Beer Style')
        .style('font-weight', 'bold');
    
    // Creates y axis label
    labelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -(sheight/4) * 2.6 )
        .attr("y", 10)
        .style('font-weight', 'bold')
        .text("Cluster Number");

    rollOver(d3.selectAll('.styleSquare'), data, style_clusters, value);
    
}

function rollOver(blockgroup, cluster, style_clusters, ChosenValue) {

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([115, 115])
        .html(function (d, i) {
            return (`Cluster Number: ${+d[0] + 1}`);
        });

    d3.selectAll('.styleSquare').call(toolTip);

    var swidth = d3.select('#hm').select('svg').nodes()[0].clientWidth;
    var sheight = d3.select('#hm').select('svg').nodes()[0].clientHeight;

    var xLinearScale = d3.scaleLinear()
    .domain([0,13])
    .range([50, swidth - 100]);
    var yLinearScale = d3.scaleLinear()
        .domain([0,29])
        .range([sheight, 70]);
    var scaledWidth = xLinearScale(2) - xLinearScale(1);
    var scaledHeight = yLinearScale(1) - yLinearScale(2);
    var newscaledWidth = xLinearScale(2.1) - xLinearScale(1);
    var newscaledHeight = yLinearScale(1) - yLinearScale(2.25);

    var bubble_data = {};
    
    d3.selectAll('.styleSquare').on('mouseover', function (labels) {
            if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
                d3.select(this)
                .attr('width', newscaledWidth)
                    .attr('height', newscaledHeight)
                    .style("stroke", 'white')
                    .attr('transform', `translate(${-2} , ${-2.5})`).raise();
                    toolTip.show(labels, this);
            }
            else {
                d3.select(this).style('cursor', 'auto');
            }
        }).on('mouseout', function (labels) {
            var strokecolor = d3.select(this).nodes()[0].style.fill;
    
            if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
                d3.select(this)
                    .attr('width', scaledWidth)
                    .attr('transform', `translate(${0} , ${0})`)
                    .style("stroke", strokecolor)
                    .attr('height', scaledHeight * .83);
                    toolTip.hide(labels);
            }
        }).on('click', function () {
            d3.select('#bubbles').html('');

            d3.event.stopPropagation();
    
            if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
                d3.select('.pie .card-head').html('');
                var chosenCluster = d3.select(this).nodes()[0].__data__[0];
                var chosenStyle = removeClass(d3.select(this).nodes()[0].classList.value);
                alterTable(this, cluster[chosenCluster]);
    
                bubblePackChoice(cluster[chosenCluster], chosenCluster, ChosenValue);
                drawPieChart2(style_clusters[chosenCluster], cluster[chosenCluster], chosenStyle);
                d3.select('.pie').classed('vis', true).classed('hid', false); 
                d3.select('.pie .card-head').append('h4')
                    .text(`Cluster ${+chosenCluster + 1}: ${chosenStyle} - Sub-styles`).classed('sectionTitles', true)
                    .style('font-size', '1rem');
                if (window.matchMedia("(max-width: 992px)").matches) { 
                    d3.select('.tree').style('top', '0%');
                }
                else {
                    d3.select('.tree').style('top', '-36.5%');
                }
            }
            else {
                clearBubbles();
                d3.select('.tree').style('top', '0%');
                d3.select('.pie .card-head').html('');
                d3.select('.pie').classed('vis', false).classed('hid', true); 
                notation();
            }
        });
}

// Function for heatmap tooltips and mouse events
function blockHover(objs, cluster, set_styles) {

    var swidth = d3.select('#hm').select('svg').nodes()[0].clientWidth;
    var sheight = d3.select('#hm').select('svg').nodes()[0].clientHeight;

    var xLinearScale = d3.scaleLinear()
    .domain([0,13])
    .range([50, swidth - 100]);
    var yLinearScale = d3.scaleLinear()
        .domain([0,29])
        .range([sheight, 70]);
    var scaledWidth = xLinearScale(2) - xLinearScale(1);
    var scaledHeight = yLinearScale(1) - yLinearScale(2);
    var newscaledWidth = xLinearScale(2.1) - xLinearScale(1);
    var newscaledHeight = yLinearScale(1) - yLinearScale(2.25);

    var bubble_data = {};
    
    objs.on('mouseover', function () {
        if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
            d3.select(this)
            .attr('width', newscaledWidth)
                .attr('height', newscaledHeight)
                .style("stroke", 'white')
                .attr('transform', `translate(${-2} , ${-2.5})`).raise();
        }
        else {
            d3.select(this).style('cursor', 'auto');
        }
    }).on('mouseout', function () {
        var strokecolor = d3.select(this).nodes()[0].style.fill;

        if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
            d3.select(this)
                .attr('width', scaledWidth)
                .attr('transform', `translate(${0} , ${0})`)
                .style("stroke", strokecolor)
                .attr('height', scaledHeight * .83);
        }
    }).on('click', function () {
        d3.select('#bubbles').html('');

        if (d3.select(this).nodes()[0].style.fill !== 'rgb(255, 255, 255)') {
            var chosenCluster = d3.select(this).nodes()[0].__data__[0];
            var chosenStyle = removeClass(d3.select(this).nodes()[0].classList.value);

            bubblePackChoice(cluster[chosenCluster], chosenCluster, ChosenValue);
            d3.select('.pie').classed('vis', false).classed('hid', true); 
        }
    });
}

// Function to determine fill color
function fillColor(rating) {
    var scale = d3.scaleLinear()
        .domain([2.5, 5])
        .range(['#5ac47c', '#FF1177']);
    
    var fillcolor = '';
    if (rating) {
        scale(rating);
    }
    else {
        fillcolor = 'white';
    }
    return fillcolor;
}

// Function to remove a class from class list
function removeClass(string) {
    var newString = string.split('styleSquare ')[1];
    return newString;
}

// Function to join strings for label formatting
function splitStyle(string) {
    var newString = string.split(' and ').join('/');
    return newString;
}

// Function to create packed bubbles
function bubblePackChoice(clusterdata, cluster, value) {

    d3.select('#bubbles').html('');
    d3.select('#bubbles').select('svg').selectAll('circle').remove();

    // Height, width for packed bubble plot
    var width = 340, height = 300;

    var voveralls = [];

    Object.entries(clusterdata.beers).map(function (d) {
        voveralls.push(d[1].total_per_cluster);
    })

    var colorScale = d3.scaleLinear().domain([3.7, 5]).range(['#5ac47c', '#FF1177']);
    if (cluster == 1) {
        var sizescale = d3.scaleSqrt()
            .domain([1, 2000])
            .range([8, 25]);
        var forceScale = d3.scaleLinear().domain([d3.min(voveralls), d3.max(voveralls)])
            .range(35, 15);
    }
    else {
        var sizescale = d3.scaleSqrt()
            .domain([1, 10])
            .range([8, 25]);
        var forceScale = d3.scaleLinear().domain([d3.min(voveralls), d3.max(voveralls)])
            .range(35, 15);
    }

    // Defines nodes for bubbles and binds data
    var nodes = Object.entries(clusterdata.beers).map(function (d) {
        return {
            radius: d[1].total_per_cluster, id: d[0], overall: d[1].ratings.group_overall, taste: d[1].ratings.group_taste, 
            palate: d[1].ratings.group_palate, aroma: d[1].ratings.group_aroma, appearance: d[1].ratings.group_appearance,
            fill: colorScale(d[1].ratings.group_overall), style: d[1].main_style, substyle: d[1].beer_style, brewery: d[1].brewery
        }
    });

    // Defines svg element
    var bsvg = d3.select("#bubbles").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "bubble");

    // Creates force simulation to create bubble layout
    var simulation = d3.forceSimulation(nodes)
        .alpha(0.5)
        .force('charge', d3.forceManyBody().strength(function (d) {
            return forceScale(d.radius)
        }))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function (d) {
            return sizescale(d.radius)
        }))
        .on('tick', ticked);

    // Speeds the simulation
    simulation.alphaDecay(0.1);

    // Function to initalize bubbles and simulation
    function ticked() {
        var u = d3.select('#bubbles').select('svg')
            .selectAll('circle')
            .data(nodes);

        // Creates bubbles
        u.enter()
            .append('circle')
            .classed('bubble', true)
            .attr('r', function (d) {
                return sizescale(d.radius)
            })
            .merge(u)
            .attr('cx', function (d) {
                return d.x
            })
            .attr('cy', function (d) {
                return d.y
            })
            .style('fill', function (d) {
                return colorScale(d[value])
            })
            .style('fill-opacity', 0.9);

        u.exit().remove();
        bubblePlotHoverChoice(u);
    }
    sizenotation();

    function sizenotation() {
        d3.select('#bubbles').append('p').text("* Size: times reviewed within cluster")
            .style('color', '#b9b9b9').attr('text-anchor', 'middle').style('font-size', '0.75rem');
        d3.select('#bubbles').selectAll('p').append('p').text("* Color: average overall rating")
            .style('color', '#b9b9b9').attr('text-anchor', 'middle').style('font-size', '0.75rem').style('margin-bottom', 0);
    }
}

function notation() {
    d3.select('#bubbles').append('text').text("* Select a cluster/beer style to view top 100 beers' popularity")
        .style('color', '#b9b9b9').attr('text-anchor', 'middle').style('font-size', '0.7rem');
}

// Function to create summary table - not used
function drawTable() {

    var labels = [{ 'Cluster: ': ' -' }, { 'Style: ': ' -' }, { 'Avg Overall Rating (Cluster): ': ' -' },
        { 'Avg Taste Rating (Cluster): ': ' -' }, { 'Avg Palate Rating (Cluster): ': ' -' },
        { 'Avg Aroma Rating (Cluster): ': ' -' }, { 'Avg Appearance Rating (Cluster): ': ' -' }];
    var tbl = d3.select('#bubble_table').append('table').append('tbody');
    tbl.selectAll('tr').data(labels).enter().append('tr').style('font-size', '0.75rem')
        .html(d => `<th>${Object.keys(d)}</th><td>${Object.values(d)}</td>`);
    
}

// Function to fill summary table - not used
function alterTable(element, data) {

    d3.select('#bubble_table').html('');

    var element_data = d3.select(element).nodes()[0].__data__;
    var element_style = d3.select(element).nodes()[0].classList.value.split('styleSquare ')[1];

    var labels = [{ 'Cluster: ': +element_data[0] + 1 }, { 'Style: ': splitStyle(element_style) }, { 'Avg Overall Rating (Cluster): ': data.styles[element_style].group_overall },
        { 'Avg Taste Rating (Cluster): ': data.styles[element_style].group_taste }, { 'Avg Palate Rating (Cluster): ': data.styles[element_style].group_palate },
        { 'Avg Aroma Rating (Cluster): ': data.styles[element_style].group_aroma }, { 'Avg Appearance Rating (Cluster): ': data.styles[element_style].group_appearance }];
    var tbl = d3.select('#bubble_table').append('table').append('tbody');
    tbl.selectAll('tr').data(labels).enter().append('tr').style('font-size', '0.75rem')
        .html(d => `<th>${Object.keys(d)}</th><td>${Object.values(d)}</td>`);
}

// Function to clear bubbles from html
function clearBubbles() {
    d3.select('body').on('click', function () {
        d3.select('#bubbles').html('');
        d3.select('#bubble_table').html('');
        d3.selectAll('.d3-tip_bubble').remove();
        drawTable();
        notation();
        d3.select('.pie').classed('vis', false).classed('hid', true);  
        d3.select('.tree').style('top', '0%');
        d3.select('.pie .card-head').html('');
    })
}

// Function to create color legends
function drawColorScale(svg) {

    var pallete = svg.append('g')
        .attr('id', 'pallete');
    var swatch = pallete.selectAll('rect')
        .data(['#FF1177', '#ce4778', '#ac6a7a', '#83977b', '#5ac47c'])
        .attr('width', 20)
        .attr('height', 20);
    
    var width = svg.nodes()[0].parentElement.attributes.width.value.split('%')[0];
    var height = svg.nodes()[0].parentElement.attributes.height.value.split('%')[0];

    swatch.enter().append('rect')
        .attr('fill', d => d)
        .attr('x', 0)
        .attr('y', (d, i) => (i * 20))
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill-opacity', 0.5)
        .attr("transform", `translate(20, ${+height - 20})`);
    
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'end').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').style('position', 'absolute').attr("transform", `translate(70, ${+height - 10})`).html('5.0');
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'end').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').style('position', 'absolute').attr("transform", `translate(70, ${+height - 20 + 100})`).html('3.0');
    pallete.append('text').style('color', 'dimgray').style('text-anchor', 'left').style('opacity', 0.6).style('font-size', '10px').style('fill', 'dimgray').style('position', 'absolute').attr("transform", `translate(25, ${+height - 20 + 120})`).html('Avg Rating');

}

// Function to create pie chart
function drawPieChart2(style_data, cluster_data, style) {

    Object.keys(style_data).forEach(style => {
        var subsets = {};
        Object.values(cluster_data.beers).forEach(beer => {
            if (beer.main_style == style) {
                subsets[beer.beer_style] = beer.ratings.sub_style_cluster_count;
            }
        })
        style_data[style] = subsets;
    })

    var new_data = {};
    Object.entries(style_data[style]).forEach(styl => {
        new_data[styl[0]] = styl[1];
    })

    var lgth = Object.values(new_data).length;

    var width = 340, height = 320;
    var colorscale = d3.scaleLinear().domain([0, lgth]).range(['#ff1177', '#5ac47c']);

    var val = [];
    var colors = [];
    Object.values(new_data).forEach((item, i) => {
        val.push(item);
        colors.push(colorscale(i));
    })
    
    var data = [{
        values: val,
        labels: Object.keys(new_data),
        type: 'pie',
        marker: {
            colors: colors
          }
      }];
      
    var layout = {
        height: height,
        width: width,
        showlegend: false,
        margin: {
            l: 60,
            r: 60,
            b: 10,
            t: 50,
            pad: 0
        }
      };
      
    Plotly.newPlot('pie', data, layout, {displayModeBar: false});
}

// Function to creat and call tooltips on packed bubbles
function bubblePlotHoverChoice(objs) {

    objs.attr('pointer-events', 'none');
    setTimeout(function () {
        objs.attr('pointer-events', 'auto');
    }, 1100);

    var toolTip = d3.tip()
        .attr("class", "d3-tip_bubble")
        .offset([-7, -95])
        .html(function (d) {
            return (`${d.id}<br>${d.brewery}<br>Style: ${d.style}: ${d.substyle}<br>Times Reviewed: ${d.radius}<br>Overall: ${d.overall}<br>Taste: ${d.taste}<br>Palate: ${d.palate}<br>Aroma: ${d.aroma}<br>Appearance: ${d.appearance}`);
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

// Function to create tree map - cluster distribution
function createTreeMap(clusterdata, chosenText) {

    var labels = { 'Overall': 'overall', 'Taste': 'taste', 'Palate': 'palate', 'Appearance': 'appearance', 'Aroma': 'aroma' };
    var chosenvalue = labels[chosenText];

    var totals = [];
    Object.values(clusterdata).map(d => totals.push(d.group_stats.total_users_per_cluster));
    var ttl = d3.sum(totals);

    var scale = d3.scaleLinear()
        .domain([0, 3.5, 5])
        .range(['#ffffff', '#5ac47c', '#FF1177']);
    var data = [];

    Object.entries(clusterdata).map(d => {
        var temp = {};
        temp['value'] = d[1].group_stats.total_users_per_cluster;
        temp['name'] = d[0];
        temp['overall'] = d[1].group_stats.avg_overall;
        temp['taste'] = d[1].group_stats.avg_taste;
        temp['palate'] = d[1].group_stats.avg_palate;
        temp['aroma'] = d[1].group_stats.avg_aroma;
        temp['appearance'] = d[1].group_stats.avg_appearance;
        temp['perc'] = +d[1].group_stats.total_users_per_cluster / +ttl * 100;
        data.push(temp);
    })

    data = data.sort(function (a, b) { return +b.value - +a.value });

    var width = 700;
    var height = 400;
    var margin = { 'top': 20, 'bottom': 20, 'left': 20, 'right': 20 };

    var svg = d3.select('#tree').append('div').classed('treediv', true)
        .append('svg').attr('width', '100%')
        .attr('height', '100%')
        .classed('treeholder', true).append('g');

    var tree = {
        name: "tree",
        children: data
    };

    var root = d3.hierarchy(tree).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

    var treemap = d3.treemap()
        .size([width - 2*margin.left, height - 2*margin.top])
        .padding(0)
        (root);
    
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "white")
        .style("fill", (d, i) => scale(data[i][chosenvalue]))
        .classed('treesq', true);
    
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 0 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
        .text((d, i) => `${data[i].name}`)
        .attr("font-size", "0.75rem")
        .attr("fill", "white");

}
