let fs = require("fs");
let path = require("path");
function readVersionJsonFile() {
  let versionNumber = '';
  const versionJsonPath = path.join(__dirname, "build", "version.json");
  fs.readFile(versionJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    var obj = JSON.parse(data);
    versionNumber = obj.buildVersion;
    renameFile(versionNumber)
  })

}
function renameFile(buildVersion) {
  const oldJSPath = path.join(__dirname, "build", "index.html");
  const newJSPath = path.join(__dirname, "build", buildVersion + ".html");
  const oldAppPath = path.join(__dirname, "build", "app.html");
  const newAppPath = path.join(__dirname, "build", "index.html");
  fs.renameSync(oldJSPath, newJSPath);
  fs.renameSync(oldAppPath, newAppPath);
}
readVersionJsonFile()