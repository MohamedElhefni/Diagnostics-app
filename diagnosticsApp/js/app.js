if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(reg => console.log(" registerd", reg))
      .catch(err => console.log("not registerd", err));
  }
