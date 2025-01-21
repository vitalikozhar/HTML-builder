const path = require('path');
const fs2 = require('fs').promises;

const pathIndex = path.join(__dirname, 'template.html');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathProjectDistIndex = path.join(pathProjectDist, 'index.html');
const pathComponents = path.join(__dirname, 'components');

(async function buildPage() {
  await fs2.mkdir(pathProjectDist, { recursive: true });
  console.log(`create folder "project-dist"`);

  await fs2.copyFile(pathIndex, pathProjectDistIndex);

  console.log(`copy file "template.html" in "project-dist/index.html"`);
  await changeTags('{{header}}');
  await changeTags('{{articles}}');
  await changeTags('{{footer}}');
  await changeTags('{{about}}');
})();

async function changeTags(tag) {
  try {
    const files = await fs2.readdir(pathComponents, { withFileTypes: true });

    for (const file of files) {
      const componentName = path.parse(file.name).name;

      if (`{{${componentName}}}` === tag) {
        const componentPath = path.join(pathComponents, file.name);
        const htmlText = await fs2.readFile(componentPath, 'utf-8');
        const data = await fs2.readFile(pathProjectDistIndex, 'utf-8');
        const updatedData = data.replace(new RegExp(tag, 'g'), htmlText);
        await fs2.writeFile(pathProjectDistIndex, updatedData, 'utf-8');
        console.log(`Tag ${tag} replaced with content from ${file.name}`);
        return;
      }
    }
    console.log(`Component for tag ${tag} not found.`);
  } catch (err) {
    console.error(`Error processing tag ${tag}:`, err);
  }
}

const fs = require('fs');
const pathStyles = path.join(__dirname, 'styles');
const pathOutputFile = path.join(__dirname, 'project-dist', 'style.css');
const writeStream = fs.createWriteStream(pathOutputFile, {
  flag: 'w',
  encoding: 'utf-8',
});

writeStream.on('error', (err) => {
  console.error('Error writing to style.css:', err);
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
        writeStream.write(chunk + '\n');
      });

      fileReadStream.on('end', () => {
        console.log(`file ${pathFile} read and add`);
        if (index === files.length - 1) {
          writeStream.end(() => {
            console.log(
              'All CSS files have been successfully merged into style.css.',
            );
          });
        }
      });
    });
  }
});

const newFolder = path.join(__dirname, 'project-dist/assets');
const oldFolder = path.join(__dirname, 'assets');

fs.mkdir(newFolder, { recursive: true }, () => {
  fs.readdir(oldFolder, { withFileTypes: true }, (err, items) => {
    if (err) {
      console.log('Error: Folder not found or cannot be read:', err);
    } else {
      for (const item of items) {
        const oldLink = path.join(oldFolder, item.name);
        const newLink = path.join(newFolder, item.name);
        fs.mkdir(newLink, { recursive: true }, () => {
          if (err) {
            console.log('Error: Folder not found or cannot be read:', err);
          } else {
            fs.readdir(oldLink, { withFileTypes: true }, (err, items2) => {
              if (err) {
                console.log('Error: Folder not found or cannot be read:', err);
              } else {
                for (const item2 of items2) {
                  const oldLink2 = path.join(oldLink, item2.name);
                  const newLink2 = path.join(newLink, item2.name);
                  if (item2.isFile()) {
                    fs.copyFile(oldLink2, newLink2, () => {
                      console.log(
                        `File "${item2.name}" has been successfully copied.`,
                      );
                    });
                  }
                }
              }
            });
          }
        });
      }
    }
  });
});
