let cpuName = document.getElementById("cpuName");
let chartColors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
];

let config = {
  type: "line",
  data: {
    datasets: [],
  },
  options: {
    responsive: false,
    title: {
      display: true,
      text: "CPU History ",
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          realtime: {
            duration: 20000,
            refresh: 1000,
            delay: 2000,
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "value",
          },
        },
      ],
    },
    tooltips: {
      mode: "nearest",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
  },
};
// let testDatasets = createDataset([
//   {
//     label: `Processor 1`,
//     // backgroundColor: color(chartColors[i]).alpha(0.5).rgbString(),
//     borderColor: chartColors[0],
//     fill: false,
//     cubicInterpolationMode: "monotone",
//     data: [],
//   },
//   {
//     label: `Processor 2`,
//     // backgroundColor: color(chartColors[i]).alpha(0.5).rgbString(),
//     borderColor: chartColors[1],
//     fill: false,
//     cubicInterpolationMode: "monotone",
//     data: [],
//   },
// ]);

var ctx = document.getElementById("myChart").getContext("2d");
let myChart = new Chart(ctx, config);

var port = chrome.runtime.connect({ name: "knockknock" });
port.postMessage({ question: "getCpuInformation" });
port.onMessage.addListener(function (msg) {
  if (msg.cpu) {
    cpuName.textContent = msg.cpu.modelName;
    myChart.data.datasets = createDataset(msg.cpu.processors);
    myChart.update({
      preservation: true,
    });
    port.postMessage({ question: "getCpuUsage" });
  }


  if (msg.usage) {
    msg.usage.forEach((usage) => {
      myChart.data.datasets[usage.id].data.push({
        x: Date.now(),
        y: usage.usage,
      });
    });
    myChart.update({
      preservation: true,
    });
  }
});

function createDataset(processors) {
  let datasests = [];

  processors.forEach((processor, i) => {
    let processorSet = {
      label: `Processor ${i + 1}`,
      // backgroundColor: color(chartColors[i]).alpha(0.5).rgbString(),
      borderColor: chartColors[i],
      fill: false,
      cubicInterpolationMode: "monotone",
      data: [],
    };
    datasests.push(processorSet);
  });
  return datasests;
}

function randomScalingFactor() {
  return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
}

// setInterval(function () {
//   myChart.data.datasets.forEach((dataset) => {
//       if(dataset.data.length >= 7)
//       {
//         dataset.data.shift()
//       }
//     let num = Math.floor(Math.random() * 20);
//     dataset.data.push(num);
//   });
//   myChart.update();
// }, 500);

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

// addData(myChart, "test", 100)
