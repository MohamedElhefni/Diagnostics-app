"use strict";

let oldInfo = 0;

function getCpuUsage(info) {
  let usage = [];
  info.processors.forEach((processor, i) => {
    if (oldInfo) {
      let oldUsage = oldInfo.processors[i].usage;
      let usedInPercentage = Math.floor(
        ((processor.usage.kernel +
          processor.usage.user -
          (oldUsage.kernel + oldUsage.user)) /
          (processor.usage.total - oldUsage.total)) *
          100
      );
      usage.push({ id: i, usage: usedInPercentage });
    } else {
      let usedInPercentage = Math.floor(
        ((processor.usage.kernel + processor.usage.user) /
          processor.usage.total) *
          100
      );
      usage.push({ id: i, usage: usedInPercentage });
    }
  });
  oldInfo = info;
  return usage;
}

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function (msg) {
    if (msg.question == "getCpuInformation") {
      chrome.system.cpu.getInfo(function (info) {
        port.postMessage({ cpu: info });
      });
    } else if (msg.question == "getCpuUsage") {
      let cpuInterval = setInterval(sendCpuUsage, 1000);
      function sendCpuUsage() {
        chrome.system.cpu.getInfo((info) => {
          let usage = getCpuUsage(info);
          port.postMessage({ usage: usage });
        });
      }
      port.onDisconnect.addListener(function () {
        clearInterval(cpuInterval);
        port = null;
      });
    }

   
  });
});


chrome.system.cpu.getInfo(function (info) {
  // console.log(JSON.stringify(info));
  console.log(info);
});

// setInterval(() => {
//   chrome.system.memory.getInfo(function (info) {
//     // console.log(JSON.stringify(info));
//     console.log(info.availableCapacity);
//   });
// }, 1000)

chrome.system.storage.getInfo(function (info) {
  // console.log(JSON.stringify(info));
  console.log(info);
});

