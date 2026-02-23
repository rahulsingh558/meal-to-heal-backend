const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
    const directoryPath = path.join(__dirname, '../../uploads/corousals');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan files!",
                error: err
            });
        }

        const imageFiles = files.filter(file => {
            const extension = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension);
        });

        const fileUrls = imageFiles.map(file => `/uploads/corousals/${file}`);
        res.status(200).send(fileUrls);
    });
});

module.exports = router;
