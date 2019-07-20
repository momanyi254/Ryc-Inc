const express = require('express');
const router = express.Router();
const car = require('../controller/car');
const checkAuth = require('../middleware/authorization');
const validation = require('../middleware/validations')

const hiredCars = [];

router.post('/', checkAuth, (req, res) => {

    const { error } = validation.hireValidator(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }

    const checkcar = car.checkCar().find(check => check.id === parseInt(req.body.id))
    
		const checkcar1 = hiredCars.find(check => check.id === parseInt(req.body.id))

    const available = hiredCars.find(available => available.hiredBy === (req.decoded['email']));
    
    const available1 = hiredCars.find(available => available.hiredBy !== (req.decoded['email']));

    if (!checkcar) {
        res.status(404).json({
            status: 404,
            massege: 'Car id ' + `${req.body.id}` + ' is not available for hire'
        });
    } else if (  checkcar.status === 'pending' || checkcar.status === 'sold') {
        res.status(404).json({
            status: 404,
            massege: 'Car with id ' + `${req.body.id}` + ' is unavailable, check back after 72 hrs'
        });
    }

    else if ( available && checkcar1) {
        res.status(409).json({
            status: 409,
            Message: 'Sorry, you already hired this car',
        });
    }
    else if ( available1) {
        res.status(409).json({
            status: 409,
            Message: 'Sorry, Another client hired this car',
        });
    }
    else {
        checkcar['status'] = 'hired';
        const hire = {
            Ticket_No: hiredCars.length + 1,
            id:parseInt(req.body.id),
            daysHired:parseInt(req.body.daysHired),
            hiredBy: req.decoded['email'],
            Created_on: new Date(),
            price: checkcar.price,
            priceEstimates:parseInt(req.body.priceEstimates)
        };
        hiredCars.push(hire);
        console.log(hiredCars)
        res.status(201).json({
            status: 201,
            message: 'Car Hired',
            data: hire
        });
    }


})

router.get('/', (req, res) => {
    if (hiredCars.length < 1) {
        return res.status(200).json({
            status: 200,
            message: 'No hired cars at the moment'
        })
    } else {
        return res.status(200).json({
            status: 200,
            message: 'All hired cars',
            count: hiredCars.length,
            data: hiredCars
        })
    }
})
router.get('/:Ticket_No', (req, res) => {
    const checkcar = hiredCars.find(check => check.Ticket_No === parseInt(req.params.Ticket_No))

    if (!checkcar) {
        res.status(404).json({
            status: 404,
            massege: 'Ticket_No ' + `${req.params.Ticket_No}` + ' is not found'
        });
    }
    else {
        return res.status(200).json({
            status: 200,
            message:'Car hired with Ticket_No '+ `${req.params.Ticket_No}` +' was found',
            data: checkcar
        })
    }
})
router.delete('/:Ticket_No', (req, res) => {
    const checkcar = hiredCars.find(check => check.Ticket_No === parseInt(req.params.Ticket_No))

    if (!checkcar) {
        res.status(404).json({
            status: 404,
            massege: 'Ticket_No ' + `${req.params.Ticket_No}` + ' is not found'
        });
    }
    else {
		const index = hiredCars.indexOf(car);
		hiredCars.splice(index, 1);
			res.status(200).json({
				status:200,
                message:'Car hired with Ticket_No '+ `${req.params.Ticket_No}` +' was deleted',
				deleted: checkcar
			})
	}
})

module.exports = router;