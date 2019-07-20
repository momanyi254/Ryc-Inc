const express = require('express');
const router = express.Router();
const validation =  require('../middleware/validations')
const checkAuth = require('../middleware/authorization');
const car = require('../controller/car')

const multer = require('multer');

const store = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null,file.originalname);
	}
});
const upload = multer({ storage: store });

router.post('/',checkAuth, upload.single('carImage'), car.postCar);

router.get('/', car.getCars);

router.get('/:id',car.getsinglecar);

router.delete('/:id', car.deletecar);

module.exports=router;