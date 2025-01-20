const path = require('path');
const fs = require('fs');

const pathStyles = path.join(__dirname, 'styles');
const pathOutputFile = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(pathOutputFile, {
  flag: 'w',
  encoding: 'utf-8',
});

writeStream.on('error', (err) => {
  console.error('Error writing to bundle.css:', err);
});

fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error: file not found.', err);
    writeStream.end();
    return;
  } else {
    files = files.filter((element) => path.extname(element.name) === '.css');
    files.forEach((file, index) => {
      const pathFile = path.join(pathStyles, file.name);
      const fileReadStream = fs.createReadStream(pathFile, {
        encoding: 'utf-8',
      });

      fileReadStream.on('error', (err) => {
        console.error(`Error reading file: ${pathFile} `, err);
      });

      fileReadStream.on('data', (chunk) => {
        writeStream.write(chunk + "\n");
      });

      fileReadStream.on('end', () => {
        console.log(`file ${pathFile} read and add`);
        if (index === files.length - 1) {
          writeStream.end(() => {
            console.log('All CSS files have been successfully merged into bundle.css.');
          });
        }
      });
    });
  }
});
