function drawImage(n) {
    
  
   
    let blockSize = 3;
  
   
    for (let i = 0; i < n; i++) {
      let line = '';
     
      for (let j = 0; j < n; j++) {
        if ((i + j) % 2 === 0) {
          line += '*';
        } else {
          line += '#';
        }
      }
  
      console.log(line);
    }
  }
  
  
  drawImage(5);
  console.log("\n=========================\n");
  drawImage(7);
  