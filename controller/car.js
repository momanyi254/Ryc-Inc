
const validation = require('../middleware/validations')
const cloudinary = require('cloudinary').v2;


const carsList = [ {
	"id": 1,
	"owner": "momanyi@hotmail.com",
	"created_on": "2019-07-18T13:16:57.303Z",
	"manufacturer": "Toyota0",
	"model": "Prado",
	"price": 9874,
	"state": "new",
	"status": "available"
},
{
	"id": 2,
	"owner": "momanyi@hotmail.com",
	"created_on": "2019-07-18T13:17:03.355Z",
	"manufacturer": "Toyota0",
	"model": "Prado",
	"price": 45678,
	"state": "new",
	"status": "available"
},
{
	"id": 3,
	"owner": "momanyi@hotmail.com",
	"created_on": "2019-07-18T13:17:05.338Z",
	"manufacturer": "Toyota0",
	"model": "Prado",
	"price": 50000,
	"state": "new",
	"status": "available"
}]


exports.checkCar = () => {
	return carsList;
}

exports.postCar = (req, res) => {

	const { error } = validation.carValidator(req.body);
	if (error) {
		return res.status(400).json({
			status: 400,
			message: error.details[0].message
		});
	}
	const available = carsList.find(available => available.owner === (req.decoded['email']));

	const car = carsList.find(c => c.id === parseInt(req.params.id));
	if (available && car) {
		res.status(409).json({
			status: 409,
			Message: 'Sorry, you already posted this car',
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
	else {
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
					status: 'available'
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
}



exports.getCars = (req, res) => {
	if (carsList.length < 1) {
		return res.status(200).json({
			status: 200,
			Message: 'No cars at the moment',
		});
	} else {
		res.status(200).json({
			status: 200,
			count: carsList.length,
			message: 'All cars available',
			data: carsList
		})
	}

}
exports.getsinglecar = (req, res)=>{
	const car = carsList.find(c => c.id === parseInt(req.params.id));
		if (!car) {
			res.status(404).json({
				status:404,
				message:'Car with id '+ `${req.params.id}` +' is not found'
			});
		}
		else {
				res.status(200).json({
					status:200,
					message:'Car with id '+ `${req.params.id}` +' was found',
					Show_car: car
				})
		}
}
exports.deletecar = (req, res ) =>{
	
	const car = carsList.find(c => c.id === parseInt(req.params.id));

	if (!car) {
		res.status(404).json({
			status:404,
			message:'Car with id '+ `${req.params.id}` +' is not found'
		});
	
	}
	else {
		const index = carsList.indexOf(car);
		carsList.splice(index, 1);
			res.status(200).json({
				status:200,
				message:'Car with id '+ `${req.params.id}` +' was deleted',
				deleted: car
			})
	}

}
