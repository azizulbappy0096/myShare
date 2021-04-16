// import modules
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// model
const FileModel = require("../model/fileSchema");

// services
const sendMail = require("../services/mailService");
const mailTemplate = require("../services/mailTemplate");

// multer diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/public/uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `file-${new Date().getTime()}${path.extname(file.originalname)}`);
  },
});

// upload
const upload = multer({
  storage,
});


// upload a file
router.post("/file/upload", upload.single("shareFile"), async (req, res) => {
  const { file } = req;
  const eventEmmiter = req.app.get("eventEmitter");
  const maxLimit = 100;
  const baseUrl = `${req.protocol}://${req.get("host")}/`;


  if (!file) {
    res.status(400).json({
      error: "No file found, please try again!",
    });
    return;
  }

  try {
    const newFile = new FileModel({
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      uuid: uuid(),
    });
    eventEmmiter.on("delFile", () => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("File deleted successfully");
      });
    });
    const savedFile = await newFile.save();
    // res.setHeader("Cache-Control", "public");
    res.setHeader("Cache-Control", "no-store, max-age=0, no-cache");
    res.status(201).json({
      shareFile: `${baseUrl}file/${savedFile.uuid}`,
      uuid: savedFile.uuid,
    });
  } catch (err) {
    eventEmmiter.emit("delFile");

    res.status(500).json({
      error: "Something went wrong!",
    });
  }
});

//get file info
router.get("/file/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const { fileName, fileSize } = await FileModel.findOne({ uuid });

    res.status(200).json({
      fileName,
      fileSize,
    });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
});

// get download link
router.get("/file/download/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const file = await FileModel.findOne({ uuid });
    if (!file) {
      res.status(404).send("No file found");
      return;
    }
    res.status(200).download(file.filePath);
  } catch (err) {
    res.status(500).json({
      error: "Link has been expired!",
    });
  }
});

// send e-mail
router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  //
  if (!uuid) {
    return res.status(422).json({
      error: "UUID must be provided!",
    });
  }

  try {
    const file = await FileModel.findOne({ uuid });
    if (!file) {
      return res.status(422).json({
        error: "Link has been expired!",
      });
    } else if (file.sender) {
      return res.status(422).json({
        error: "E-mail already sent!",
      });
    }

    let downloadLink = `${baseUrl}/api/file/download/${uuid}`;
    const genHtml = mailTemplate({
      emailFrom,
      baseUrl,
      downloadLink,
    });
    const text = "";

    sendMail({
      emailFrom,
      emailTo,
      text,
      html: genHtml,
    }).then(() => {
      
      res.status(200).json({
        success: "E-mail sent!",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err)
        res.status(500).json({
          error: "Something went wrong!",
        });
        return;
      }
      
    });
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Something went wrong!",
    });
  }
});

module.exports = router;
