
const car = require('../controller/car');
const validation = require('../middleware/validations');


const ordersList = [];
exports.postorder = (req, res, next) => {

	const { error } = validation.buyValidator(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details[0].message
		});
	}
	const checkcar = car.checkCar().find(check => check.id === parseInt(req.body.id))
	const checkcar1 = ordersList.find(check => check.id === parseInt(req.body.id))

	const available = ordersList.find(available => available.buyer === (req.decoded['email']));

	const available1 = ordersList.find(available => available.buyer !== (req.decoded['email']));

	if (!checkcar) {
		res.status(404).json({
			status: 404,
			massege: 'Car id ' + `${req.body.id}` + ' is not available for purchase'
		});
	} else if (checkcar.status === 'sold' || checkcar.status === 'hired') {
		res.status(404).json({
			status: 404,
			massege: 'Car with id ' + `${req.body.id}` + ' is unavailable.'
		});
	}

	else if (available && checkcar1) {
		res.status(409).json({
			status: 409,
			Message: 'Sorry, you already orders this car',
		});
	} else {

		checkcar['status'] = 'pending';
		const order = {
			order_id: ordersList.length + 1,
			id: parseInt(req.body.id),
			buyer: req.decoded['email'],
			created_on: new Date(),
			price: checkcar.price,
		};

		ordersList.push(order);
			res.status(201).json({
				Message: 'Purchase Order created succesfully',
				Created_Order: order
			})
	}
}
exports.getorders = (req, res) => {
	if (ordersList.length < 1) {
		return res.status(200).json({
			Message: 'No Purchase orders at the moment',
		});
	} else {
			res.status(200).json({
				count: ordersList.length,
				Message: 'All Purchase Orders',
				Purchase_Orders: ordersList
			})
	}
}
exports.getsingleorder = (req, res) => {
    const order = ordersList.find(c => c.order_id === parseInt(req.params.order_id));

    if (!order) {
        res.status(404).json({
            status:404,
            massege: 'order with id ' + `${req.params.order_id}` + ' is unavailable.'
        });
    }
    else {
        res.status(200).json({
            status:200,
            message:'Order with id '+ `${req.params.order_id}` +' was found',
            Purchase_Order: order
        })
    }

}
exports.deleteorder = (req, res, next) => {
    const order = ordersList.find(c => c.order_id === parseInt(req.params.order_id));

    if (!order) {
        return res.status(404).json({
        status:404,
        massege:'Order with id ' + `${req.params.order_id}` + ' is unavailable.'})
    
    }
    else {
        const index = ordersList.indexOf(order);
        ordersList.splice(index, 1);
            res.status(200).json({
                status:200,
                message:'Order with id '+ `${req.params.order_id}` +' was deleted',
                Deleted: order
            })
    }


}