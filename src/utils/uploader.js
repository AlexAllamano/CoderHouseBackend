import multer from "multer";
import fileDirName from "./fileDirName.js";
import * as path from 'path';

const { __dirname } = fileDirName(import.meta);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'img'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
