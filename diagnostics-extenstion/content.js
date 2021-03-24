let cpuName = document.getElementById("cpuName");
let memUsage = document.getElementById("memUsage");
let storageInfo = document.getElementById("storageInfo")
let chartColors = [
  "rgb(255, 99, 132)",
  "rgb(255, 159, 64)",
  "rgb(255, 205, 86)",
  "rgb(75, 192, 192)",
  "rgb(54, 162, 235)",
];

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
              stepSize: 20
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

let cpuConfig = makeConfig("CPU History ");
let cpuCharCanvas = document.getElementById("cpuChart").getContext("2d");
let cpuChart = new Chart(cpuCharCanvas, cpuConfig);

let memConfig = makeConfig("Memory History");
let memoCharCanvas = document.getElementById("memChart").getContext("2d");
let memChart = new Chart(memoCharCanvas, memConfig);
memDataSet = [
  {
    label: `Memory`,
    borderColor: chartColors[3],
    fill: false,
    cubicInterpolationMode: "monotone",
    data: [],
  },
];
memChart.data.datasets = memDataSet;
memChart.update({
  preservation: true,
});

let port = chrome.runtime.connect({ name: "systemInformation" });
port.postMessage({ question: "getInformation" });
port.onMessage.addListener(function (msg) {
  if (msg.cpu) {
    // update cpu name 
    cpuName.textContent = msg.cpu.modelName;
    cpuChart.data.datasets = createDataset(msg.cpu.processors);
    cpuChart.update({
      preservation: true,
    });
    port.postMessage({ question: "getUsage" });
  }

  if(msg.storage)
  {
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


  if (msg.usage) {
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
