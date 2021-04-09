/*
  content.js is the script which will be injected to the pwa app 
  and it will update the page with the information which will be sent from background.js
*/
let cpuName = document.getElementById("cpuName");
let memUsage = document.getElementById("memUsage");
let storageInfo = document.getElementById("storageInfo");
let cpuConfig = makeConfig("CPU History ");
let cpuCharCanvas = document.getElementById("cpuChart").getContext("2d");
let cpuChart = new Chart(cpuCharCanvas, cpuConfig);
let memConfig = makeConfig("Memory History");
let memoCharCanvas = document.getElementById("memChart").getContext("2d");
let memChart = new Chart(memoCharCanvas, memConfig);

// create memory dataset to add to chart
let memDataSet = [
  {
    label: `Memory`,
    borderColor: "rgb(75, 192, 192)",
    fill: false,
    cubicInterpolationMode: "monotone",
    data: [],
  },
];
memChart.data.datasets = memDataSet;
memChart.update({
  preservation: true,
});

/**
 * make config for Chart
 * @param {string} text
 */
function makeConfig(text) {
  return {
    type: "line",
    data: {
      datasets: [],
    },
    options: {
      responsive: false,
      title: {
        display: true,
        text: text,
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
            ticks: {
              min: 0,
              max: 100,
              stepSize: 20,
            },
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
}

function toGB(val) {
  return val / (1024 * 1024 * 1024);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * create processors datasets to pass to the config
 * @param {object} processors
 */
function createDataset(processors) {
  let datasests = [];

  processors.forEach((processor, i) => {
    let processorSet = {
      label: `Processor ${i + 1}`,
      borderColor: getRandomColor(),
      fill: false,
      cubicInterpolationMode: "monotone",
      data: [],
    };
    datasests.push(processorSet);
  });
  return datasests;
}

// start connection with background.js

const extId = "njhgenahioafobmefamgkkgfpdccgpoi";
const port = chrome.runtime.connect(extId);

port.postMessage({ question: "getInformation" });
port.onMessage.addListener(function (msg) {
  // check if the message contain cpu information
  // if it contain it will send request to get the usage of cpu and memory
  if (msg.cpu) {
    cpuName.textContent = msg.cpu.modelName;
    cpuChart.data.datasets = createDataset(msg.cpu.processors);
    cpuChart.update({
      preservation: true,
    });
    port.postMessage({ question: "getUsage" });
  }

  // check if the msg contain the storage information and update the storageInfo with it
  if (msg.storage) {
    let txt = "";
    msg.storage.forEach((storage) => {
      let capacity = toGB(storage.capacity).toFixed(2);
      txt += `
            <p> <b> name: ${storage.name} (${storage.type}) </b>
            <p> <b>Capacity: </b>  ${capacity} GB </p>
          `;
      storageInfo.innerHTML = txt;
    });
  }

  // if the msg contain the usage it will loop for each usage and update each chart with the usage of it
  if (msg.usage) {
    // update cpu chart with the usage
    msg.usage.cpuUsage.forEach((usage) => {
      cpuChart.data.datasets[usage.id].data.push({
        x: Date.now(),
        y: usage.usage,
      });
    });
    cpuChart.update({
      preservation: true,
    });

    // update memory usage title and chart
    let memo = msg.usage.memUsage;
    memUsage.textContent = `${memo.usedInGB} GiB (${memo.used}%) of ${memo.capacity} GiB`;
    memChart.data.datasets[0].data.push({
      x: Date.now(),
      y: memo.used,
    });
    memChart.update({
      preservation: true,
    });
  }
});
