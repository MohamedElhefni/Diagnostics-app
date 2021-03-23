let cpuInfo = document.getElementById("cpu-information");
let processorsUsage = document.getElementById("processorsUsage");
let memInfo = document.getElementById("memory-information");
let storageInfo = document.getElementById("storage-information")
let oldInfo = 0;


function toGB(val)
{
  return  Math.round(val / (1024 * 1024 * 1024));
}


function updateCpuUsage(info) {
  let txt = ``;
  info.processors.forEach((processor, i) => {
    if (oldInfo) {
      let oldUsage = oldInfo.processors[i].usage;
      usedInPercentage = Math.floor(((processor.usage.kernel + processor.usage.user) - (oldUsage.kernel + oldUsage.user)) / (processor.usage.total - oldUsage.total) * 100);

  } else {
      usedInPercentage = Math.floor((processor.usage.kernel + processor.usage.user) / processor.usage.total * 100);
  }
    // let usedInPercentage = Math.floor(
    //   ((processor.usage.kernel + processor.usage.user) /
    //     processor.usage.total) *
    //     100
    // );
    txt += `<p> usage of processor ${i + 1} is: ${usedInPercentage}% </p> `;
  });
  processorsUsage.innerHTML = txt;
  oldInfo = info;
}

function getCpuInformation() {
  chrome.system.cpu.getInfo(function (info) {
    let cpuSection = `
    <p> <b>Model Name: </b> <p> ${info.modelName} </p> </p>
    <p><b>Arch Name: </b> <span> ${info.archName}</span></p>
    <p><b>Feautres: </b> <p> ${info.features.join(", ")} </p></p>
    <p><b>Number Of Processors: </b> <span id="numOfProcessors"> ${
      info.numOfProcessors
    } </span></p>
  `;

    cpuInfo.innerHTML = cpuSection;
    // updateCpuUsage(info);
    setInterval(() => {
      chrome.system.cpu.getInfo(info => updateCpuUsage(info))
    }, 1000)
  });
}

function getMemUsage() {
  chrome.system.memory.getInfo(function (info) {
    let capacityInGB = toGB(info.capacity);
    let availableCapacityInGB = toGB(info.availableCapacity); 
    let memSection = `
    <p> <b>Capacity: </b>  ${capacityInGB} GB </p>
    <p> <b>Used Capacity: </b>  ${capacityInGB - availableCapacityInGB} GB </p>
    <p> <b>Availbe Capacity: </b>  ${availableCapacityInGB} GB </p>
    `;
    memInfo.innerHTML = memSection;
  });
}

function getStorageUsage() 
{
  let txt = '';
  chrome.system.storage.getInfo(function(info) {
    info.forEach(storage => {
      let capacity = toGB(storage.capacity);
      txt += `
        <p> <b> name: ${storage.name} (${storage.type}) </b>
        <p> <b>Capacity: </b>  ${capacity} GB </p>
      `;
    })
    storageInfo.innerHTML = txt;
  })
}

getCpuInformation();
getMemUsage();
getStorageUsage();