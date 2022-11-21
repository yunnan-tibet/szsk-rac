var fs = require("fs-extra"); 
var path = require('path');

var srcPath = path.resolve('./src/typings');
var libPath = path.resolve('./lib/typings');

function copyTypingDir(sP, dP) {
  fs.copy(sP, dP, function (err) { 
    if (err){ 
        console.log('An error occured while copying the folder.') 
        return console.error(err) 
    } 
    console.log('Copy completed!') 
 });
}

// function copyStyleFile(filePath) {
//   const relativePath = filePath.substr(srcPath.length);
//   const dstPath = path.join(libPath, relativePath);
//   console.log('copy file', filePath, ' -->', dstPath);
//   fs.copyFile(filePath, dstPath, (err) => {
//     if (err) {
//       console.error(err);
//     }
//   });
// }
copyTypingDir(srcPath, libPath);