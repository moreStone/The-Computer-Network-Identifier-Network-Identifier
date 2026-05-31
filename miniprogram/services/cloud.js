function getDB() {
  return wx.cloud.database();
}

function callFunction(name, data) {
  return wx.cloud
    .callFunction({
      name,
      data,
    })
    .then(res => res.result);
}

function uploadFile(filePath, cloudPath) {
  return wx.cloud.uploadFile({
    cloudPath,
    filePath,
  });
}

function getFileTempURL(fileList) {
  return wx.cloud
    .getTempFileURL({
      fileList,
    })
    .then(res => res.fileList);
}

module.exports = {
  getDB,
  callFunction,
  uploadFile,
  getFileTempURL,
};
