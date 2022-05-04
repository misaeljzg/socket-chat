const { response } = require('express');
const { request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Token not found'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //read User from uid
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Token not valid - user does not exist in DB'
            })
        }

        //Verify if user is still active
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token not valid - user disabled'
            })
        }


        req.user = user;

        next();

    } catch (error) {

        console.log(error);

        res.status(401).json({
            msg: 'Token not valid'
        })

    }
}

module.exports = { validateJWT }

