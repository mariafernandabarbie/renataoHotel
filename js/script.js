if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        let reg;
        reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
  
        console.log(reg);
      } catch (err) {
        console.log(err);
      }
    });
  }