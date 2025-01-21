const path = require('path');
const fs = require('fs');

const oldFold = path.join(__dirname, 'files');
const newFold = path.join(__dirname, 'files-copy');

fs.mkdir(newFold, { recursive: true }, (err) => {
  if (err) {
    return console.error('Error creating directory:', err);
  }

  fs.readdir(oldFold, { withFileTypes: true }, (err, oldItems) => {
    if (err) {
      return console.error('Error reading "files" directory:', err);
    }

    fs.readdir(newFold, { withFileTypes: true }, (err, newItems) => {
      if (err) {
        return console.error('Error reading "files-copy" directory:', err);
      }
      const oldFileNames = oldItems
        .filter((item) => item.isFile())
        .map((item) => item.name);
      const newFileNames = newItems
        .filter((item) => item.isFile())
        .map((item) => item.name);

      for (const newFile of newFileNames) {
        if (!oldFileNames.includes(newFile)) {
          const fileToDelete = path.join(newFold, newFile);
          fs.unlink(fileToDelete, (err) => {
            if (err) {
              console.error(`Error deleting file "${newFile}":`, err);
            } else {
              console.log(`File "${newFile}" deleted from "files-copy".`);
            }
          });
        }
      }
      for (const oldFile of oldItems) {
        if (oldFile.isFile()) {
          const oldLink = path.join(oldFold, oldFile.name);
          const newLink = path.join(newFold, oldFile.name);
          fs.copyFile(oldLink, newLink, (err) => {
            if (err) {
              console.error(`Error copying file "${oldFile.name}":`, err);
            } else {
              console.log(`File "${oldFile.name}" copied to "files-copy".`);
            }
          });
        }
      }
    });
  });
});
