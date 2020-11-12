module.exports = {

  bucketKeyFormat: (projectName) => {
    return projectName
      .replace(new RegExp("[^\x00-\x7F]+", "g"), "")
      .toLowerCase()
      .split(" ")
      .join("") + "_bucket"
  }
}