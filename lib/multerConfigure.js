const multer = require('multer');

/*const storageStrategy = multer.diskStorage({
    destination:'./public/images',
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});*/

const storageStrategy = multer.memoryStorage();

const upload = multer({storage: storageStrategy });

module.exports = {upload}
