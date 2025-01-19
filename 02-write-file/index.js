const path = require('path');
const fs = require('fs');
const readline = require('readline');

const outputFile = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(outputFile, {
  flags: 'w',
  encoding: 'utf-8',
});
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt:
    '\nEnter your text below:\n' +
    'Press ENTER to save it to output.txt.\n' +
    "Press Ctrl + C or type 'exit' to quit.\n",
});
rl.prompt();

rl.on('line', (inputText) => {
  const inArray = inputText.toLocaleLowerCase().split(' ');
  if (inArray.includes('exit')) {
    writeStream.write(inputText + '\n');
    console.log('\nExiting...');
    rl.close();
  } else {
    writeStream.write(inputText + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('\nExiting...');
  rl.close();
});
