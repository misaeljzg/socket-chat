const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async (req, res = response) => {

    const {limit = 5, from = 0} = req.query;

    const query = {status : true};

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(from).limit(limit)    
    ]);

    res.json({total, users});
}

const usersPost = async (req, res) => {

    const { name, mail, password, role } = req.body;

    const user = new User({
        name, mail, password, role
    });

    //Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);

    //Store in DB
    await user.save();

    res.json(user);
};

const usersPut = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, ...other } = req.body;

    //TODO Validate with DB

    if (password) {
        //Encrypt password
        const salt = bcryptjs.genSaltSync();
        other.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, other);

    res.json(user);
};

const usersDelete = async (req, res) => {
    const {id} = req.params;
    //Delete physically
    //const user = await User.findByIdAndDelete(id);

    const user = await User.findByIdAndUpdate(id, {status:false});

    res.json({
        user
    });
};

const usersPatch = (req, res) => {
    res.json({
        msg: 'patch API - controller'
    })
};

module.exports = {
    usersGet,
    usersPut,
    usersDelete,
    usersPatch,
    usersPost
}