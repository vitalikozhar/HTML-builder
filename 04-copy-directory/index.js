const path = require('path');
const fs = require('fs');
const oldFold = path.join(__dirname, 'files');
const newFold = path.join(__dirname, 'files-copy');
fs.mkdir(newFold, { recursive: true }, () => {
  fs.readdir(oldFold, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.log('Error: Folder not found or cannot be read:', err);
    } else {
      for (const item of items) {
        const oldLink = path.join(oldFold, item.name);
        const newLink = path.join(newFold, item.name);

        if (item.isFile()) {
          fs.copyFile(oldLink, newLink, () => {
            console.log(`File "${item.name}" has been successfully copied.`);
          });
        }
      }
    }
  });
});
