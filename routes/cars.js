const express = require('express');
const router = express.Router();
const validation =  require('../middleware/validations')
const checkAuth = require('../middleware/authorization');
const cloudinary = require('cloudinary').v2;

const multer = require('multer');

const store = multer.diskStorage({
	filename: function (req, file, cb) {
		cb(null,file.originalname);
	}
});
const upload = multer({ storage: store });

const carsList = []

router.post('/',checkAuth, upload.single('carImage'),(req,res) =>{
    
	const { error } = validation.carValidator(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			message: error.details[0].message
		});
    }
    
	// let url;
	cloudinary.config({
		cloud_name: 'momanyi254',
		api_key: '714216685274696',
		api_secret: 'ea_KokEBwJnE3x9SJm7gUEJd_Ck'
	});

	if (!req.file) return res.status(400).json({
		status: 400,
		message: 'Please upload an image',
	});
	else{
		const path = req.file.path;
		cloudinary.uploader.upload(
			path, (err, image) => {
				// if (err) res.status(400).json({ message:error });
				// else {
					// const url = image['url'];
	
					const car = {
						id: carsList.length + 1,
						owner: req.decoded['email'],
						created_on: new Date(),
						manufacturer: req.body.manufacturer,
						model: req.body.model,
						price: parseInt(req.body.price),
						state: req.body.state,
						// cloudinary_url: url
					};
	
                    carsList.push(car);
                    console.log(carsList)
					res.status(201).json({
						status: 201,
						message: 'Car posted succesfully',
						Data: car
					});
				// }
			});
	}
	
})
router.get('/', (req,res) =>{
	if (carsList.length < 1) {
		return res.status(200).json({
			status:200,
			Message: 'No cars at the moment',
		});
	} else {
			res.status(200).json({
				status:200,
				count: carsList.length,
				Message: 'All cars available',
				Data: carsList
			})
	}

})

router.get('/:id',(req, res)=>{
	const car = carsList.find(c => c.id === parseInt(req.params.id));
		if (!car) {
			res.status(404).json({
				status:404,
				massege:'Car with id '+ `${req.params.id}` +' is not found'
			});
		}
		else {
				res.status(200).json({
					status:200,
					massege:'Car with id '+ `${req.params.id}` +' was found',
					Show_car: car
				})
		}
})

router.delete('/:id', (req, res ) =>{
	
	const car = carsList.find(c => c.id === parseInt(req.params.id));

	if (!car) {
		res.status(404).json({
			status:404,
			massege:'Car with id '+ `${req.params.id}` +' is not found'
		});
	
	}
	else {
		const index = carsList.indexOf(car);
		carsList.splice(index, 1);
			res.status(200).json({
				status:200,
				massege:'Car with id '+ `${req.params.id}` +' was deleted',
				Deleted: car
			})
	}

})
module.exports=router;