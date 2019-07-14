const express = require('express');
const router = express.Router();
const validation = require('../middleware/validations')
const hash = require('../middleware/helpers')
const jwt = require('jsonwebtoken')


userList = []
router.post('/signup', (req, res) => {
    const { error } = validation.signupValidator(req.body)
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    const user = userList.find(checkmail => checkmail.email === (req.body.email));
    if (user) {
        return res.status(409).json({
            status: 409,
            message: `${req.body.email}` + ' already exists'
        });
    }
    else {
        let isAdmin = req.body.isAdmin === 'True' ? 'True' : 'False';
        const newUser = {
            id: userList.length + 1,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            password: hash.hashPassword(req.body.password),
            isAdmin: isAdmin
        }
        userList.push(newUser)
        console.log(userList)
        const data = {
            userID: newUser.id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        };
        let token = jwt.sign({
            email: newUser['email'], isAdmin: newUser['isAdmin']
        }, 'henrysecret', { expiresIn: '3h' });
        res.status(201).json({
            status: 201,
            message: `${req.body.username}` + ' created succesfully',
            data: data,
            Token: token
        });
    }
})
router.post('/signin', (req, res) => {
    const { error } = validation.loginValidator(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error.details[0].message
        });
    }
    const user = userList.find(checkmail => checkmail.email === (req.body.email));
    if (!user) {
        return res.status(400).json({
            status: 400,
            message: 'Please register first to signin'
        });
    }
    else {
        const validPassword = hash.comparePassword(req.body.password, user['password']);
        if (validPassword) {
            const token = jwt.sign({ email: user['email'] }, 'henrysecret', { expiresIn: '1h' });
            res.status(200).json({
                status: 200,
                message: `${req.body.email}` + ' logged succesfully',
                token: token
            });
        }
        else {
            res.status(401).json({
                status: 401,
                message: 'Invalid password'
            });
        }

    }
});
router.get('/', (req, res) => {
    if (userList.length < 1) {
        return res.status(400).json({
            status: 400,
            Message: 'No user',
        });
    } else {
        res.status(200).json({
            status: 200,
            count: userList.length,
            Message: 'All registered users',
            data: userList
        })
    }
})
router.delete('/:id',(req,res)=>{
    const user = userList.find(user => user.id ===parseInt(req.params.id))
    if(!user){
        res.status(404).json({
            status:404,
            massege:'User with id '+ `${req.params.id}` +' is not found'
        })
    }	else {
        const index = userList.indexOf(user);
        userList.splice(index, 1);
            res.status(200).json({
                status: 200,
                message: 'User id '+ `${req.params.id}` +' was succesfully deleted'
            
            })
    }
    

})
module.exports = router;