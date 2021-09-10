function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    let samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    let result = resultArray[0];

    // Create a variable that filters the metadata array for the object with the desired sample number.
    let metadataResult = data.metadata.filter(metadataObj => metadataObj.id == sample)[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // 3. Create a variable that holds the washing frequency.
    let wfreq = metadataResult.wfreq;

    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0, 10).map(id => "OTU " + id).reverse();

    // define colors for graph layouts
    var paper_color = "rgb(34, 34, 34)";
    var text_color = "rgb(247, 247, 247)";
    var grid_color = "rgb(247, 247, 247)"

    // Create the trace for the bar chart. 
    var barData = [{
      x : sample_values.slice(0, 10).reverse(),
      y : yticks,
      type : "bar",
      orientation: "h",
      marker: { color: "rgb(242, 111, 111)" }
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     paper_bgcolor: paper_color,
     plot_bgcolor: paper_color,
     font: { color: text_color },
     height: 355,
     width: 400,
    //  xaxis: { automargin: true },
    //  yaxis: { automargin: true },
    margin: {r: 20}
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      paper_bgcolor: paper_color,
      plot_bgcolor: paper_color,
      hovermode: "closest",
      font: { color: text_color }
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreq,
      title: {text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10], dtick: 2 },
        bar: { color: "rgb(41, 31, 30)" },
        steps: [
          { range: [0,2], color: "rgb(135, 45, 9)" },
          { range: [2,4], color: "rgb(232, 91, 35)" },
          { range: [4,6], color: "rgb(255, 209, 43)" },
          { range: [6,8], color: "rgb(24, 184, 122)" },
          { range: [8,10], color: "rgb(5, 122, 77)" },
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 350,
      height: 355,
      paper_bgcolor: paper_color,
      font: { color: text_color },
      margin: { b: 10, l: 70, t: 10, r: 40 }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
