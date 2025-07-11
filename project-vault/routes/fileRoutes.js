const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

let files = []; // In-memory file list

router.post("/upload", auth, upload.single("file"), (req, res) => {
  const file = {
    id: files.length + 1,
    filename: req.file.originalname,
    path: req.file.path,
    uploadedAt: new Date()
  };
  files.push(file);
  res.json({ message: "File uploaded successfully", file });
});

router.get("/files", auth, (req, res) => {
  res.json(files);
});

router.get("/download/:id", auth, (req, res) => {
  const file = files.find(f => f.id === parseInt(req.params.id));
  if (!file) return res.status(404).json({ message: "File not found" });
  res.download(path.resolve(file.path), file.filename);
});

module.exports = router;
