const express = require('express');
const { nanoid } = require('nanoid')
const router = express.Router();

router.post('/upload-file', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let file = req.files.file;
      const generaotrfile = `${nanoid(10)}-splits-${file.name}`
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      // file.mv('./src/uploads/'+ generaotrfile);

      //send response
      res.send({
        errcode: 0,
        message: 'File is uploaded',
        data: {
          name: generaotrfile,
          mimetype: file.mimetype,
          size: file.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
