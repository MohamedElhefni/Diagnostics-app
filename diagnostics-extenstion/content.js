var port = chrome.runtime.connect({ name: "knockknock" });
port.postMessage({ joke: "Knock knock" });
port.onMessage.addListener(function (msg) {
  console.log(msg);
});

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [1,2,3,4,5,6,7,8,9,10],
    datasets: [
      {
        label: "Dataset 1",
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        data: [0, 100],
      },
      {
        label: "Dataset 2",
        borderColor: "red",
        fill: false,
        data: [10, 15, 99, 0],
      },
    ],
  },
});

// setInterval(function () {
//   myChart.data.datasets.forEach((dataset) => {
//       if(dataset.data.length >= 7)
//       {
//         dataset.data.shift()
//       }
//     let num = Math.floor(Math.random() * 100);
//     dataset.data.push(num);
//   });
//   myChart.update();
// }, 1000);

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

// addData(myChart, "test", 100)
