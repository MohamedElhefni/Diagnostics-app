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

function getMemUsage(info) {
  var capacity, used, usedInPercentage, leftInPercentage;
  capacity = info.capacity / 1.074e9;
  used = info.availableCapacity / 1.074e9;
  leftInPercentage = Math.round((used / capacity) * 100);
  usedInPercentage = 100 - leftInPercentage;

  return {
    used: usedInPercentage,
    usedInGB: (capacity - used).toFixed(2),
    left: leftInPercentage,
    capacity: capacity.toFixed(2),
  };
}

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "systemInformation");
  port.onMessage.addListener(function (msg) {
    if (msg.question == "getInformation") {
      chrome.system.cpu.getInfo(function (info) {
        port.postMessage({cpu: info})
      });
      chrome.system.storage.getInfo(function (info) {
        port.postMessage({storage: info})
      });
    } else if (msg.question == "getUsage") {
      let usageInterval = setInterval(sendUsage, 1000);
      let usage = {};
      function sendUsage() {
        chrome.system.cpu.getInfo((info) => {
          usage.cpuUsage = getCpuUsage(info);
        });
        chrome.system.memory.getInfo((info) => {
          usage.memUsage = getMemUsage(info);
        });
        if (Object.keys(usage).length) {
          port.postMessage({ usage: usage });
        }
      }
      port.onDisconnect.addListener(function () {
        clearInterval(usageInterval);
        port = null;
      });
    }
    // else if (msg.question == "getMemUsage") {
    //   // let memInterval = setInterval(sendMemUsage, 1000);
    //   function sendMemUsage() {
    //     chrome.system.memory.getInfo(function (info) {
    //       let memUsage = getMemUsage(info);
    //       port.postMessage({ memUsage: memUsage });
    //     });
    //   }
    //   port.onDisconnect.addListener(function () {
    //     clearInterval(memInterval);
    //     port = null;
    //   });
    // }
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
