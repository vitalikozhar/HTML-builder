const fs = require('fs');
const path = require('path');
const myFolder = path.join(__dirname, '/secret-folder');

fs.readdir(myFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('Error: file not found: ', err);
  } else {
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(myFolder, file.name);
        fs.stat(filePath, (err, currentSize) => {
          if (err) {
            console.log('Error: size not found: ', err);
          } else {
            const name = file.name.split('.');
            if (name.length === 1) name.push('');
            console.log(`${name[0]} - ${name[1]} - ${currentSize.size}b `);
          }
        });
      }
    }
  }
});
