const path = require('path')
const multer = require('multer')
const storageConfig = multer.diskStorage({
    // destinations is uploads folder 
    // under the project directory
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, res) => {
        // file name is prepended with current time
        // in milliseconds to handle duplicate file names
      res(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage:storageConfig })

module.exports = upload;