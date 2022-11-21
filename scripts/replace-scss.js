const fs = require('fs');
const path = require('path');

const libPath = path.resolve('./lib');

function replaceScssText(filePath) {
  // 根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      // 遍历读取到的文件列表
      files.forEach(function (filename) {
        // 获取当前文件的绝对路径
        const filedir = path.join(filePath, filename);
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn('获取文件stats失败');
          } else {
            const isFile = stats.isFile(); // 是文件
            const isDir = stats.isDirectory(); // 是文件夹
            if (isFile && filename.match(/\.js$/)) {
              fs.readFile(filedir, function (err, data) {
                if (err) {
                  return console.error(err);
                }
                const str = data.toString();
                if (str.includes('./index.scss')) {
                  fs.writeFile(
                    filedir,
                    str.replace(/index\.scss/g, 'index.css'),
                    function (err) {
                      if (err) {
                        return console.error(err);
                      }
                    },
                  );
                }
              });
            }
            if (isDir) {
              replaceScssText(filedir); // 递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
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
replaceScssText(libPath);
