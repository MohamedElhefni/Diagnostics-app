let oldInfo = 0;

/**
 * get processors usage in percentage to push it to content.js 
 * @param {objeect} info 
 */
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

/**
 *  get memory usage in percentage to push it to content.js 
 * @param {object} info 
 */
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
// start the connection with content.js
chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name == "systemInformation");
  port.onMessage.addListener(function (msg) {
    // check if content.js requested to getInformation
    // it sends cpu and storage static information
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
      function sendUsage() { // send cpu and memory 
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
   
  });
});
