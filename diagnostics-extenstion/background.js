'use strict';

// console.log(chrome.system)

chrome.runtime.onConnect.addListener(function(port) {
   console.assert(port.name == "knockknock");
   port.onMessage.addListener(function(msg) {
      chrome.system.cpu.getInfo(function(info){       
               port.postMessage(info)
      })
      // setInterval(() => {
      //    chrome.system.cpu.getInfo(function(info){       
      //       port.postMessage(info)
      //    });
   
      // }, 1000)
      //    if (msg.joke == "Knock knock")
   //     {
   //       port.postMessage({question: "Who's there?"});
   //     }
   //   else if (msg.answer == "Madame")
   //     port.postMessage({question: "Madame who?"});
   //   else if (msg.answer == "Madame... Bovary")
   //     port.postMessage({question: "I don't get it."});
   });
 });

// chrome.tabs.query({title: "Dignostics App"}, function(tabs) {
//    chrome.tabs.sendMessage(tabs[0].id, {message: "hello"}, function(response) {
//      console.log(response);
//    });
//  });

// chrome.runtime.sendMessage("hello world from ext")


// chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
//    alert(response)
// })


chrome.system.cpu.getInfo(function(info){       
    // console.log(JSON.stringify(info));   
    console.log(info)
 });

 chrome.system.memory.getInfo(function(info){       
    // console.log(JSON.stringify(info));   
    console.log(info)
 });

 chrome.system.storage.getInfo(function(info){       
   // console.log(JSON.stringify(info));   
   console.log(info)
});

// chrome.system.display.getInfo(function(info){       
//    // console.log(JSON.stringify(info));   
//    console.log(info)
// });