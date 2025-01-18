const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "text.txt");
const fileReadStream = fs.createReadStream(filePath, {encoding: "utf-8"});
let text = "";

fileReadStream.on("data", (chunk) => {
    text += chunk;
});

fileReadStream.on("end", () => {
    console.log(text);
});

fileReadStream.on("error", (err) => {
    console.error("Error reading file:", err.message);
});