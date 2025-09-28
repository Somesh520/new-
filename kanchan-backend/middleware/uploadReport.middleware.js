const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Ensure report upload dir exists
const uploadDir = 'uploads/reports';
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueName = `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf','image/jpeg','image/png'];
    cb(null, allowedTypes.includes(file.mimetype));
};
module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});
