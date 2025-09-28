const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Ensure uploads/manuals directory exists
const uploadDir = 'uploads/manuals';
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename: <machineId>_<timestamp>.<ext>
        const machineId = req.params.id || 'manual';
        const uniqueName = `${machineId}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept PDF, images, drawings only
    const allowedTypes = [
        'application/pdf', 'image/jpeg', 'image/png',
        'image/svg+xml', 'application/zip',
        'image/bmp', 'image/gif'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, image or drawing files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max file size
    },
    fileFilter: fileFilter
});

module.exports = upload;
