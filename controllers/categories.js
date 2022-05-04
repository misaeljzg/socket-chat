const { response } = require("express");

const {Category} = require('../models');

//getCategories -paginate- total- populate

const getCategories = async (req, res ) => {
    const {limit = 5, from = 0} = req.query;

    const query = {status : true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query).skip(from).limit(limit).populate('user', 'name')  
    ]);

    res.json({total, categories});
};

//getCategory - populate

const getCategory = async  (req, res) => {
    const {id} = req.params;

    const category = await Category.findById(id).populate('user', 'name');

    res.json(category);
};

const createCategory = async (req, res=response) => {
    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({name});

    if(categoryDB) {
        return res.status(400).json({
            msg: `Category ${categoryDB.name} already exists`
        });
    }

    //Generate data to store

    const data = {
        name, 
        user: req.user._id
    }

    const category = new Category(data);

    //Store in db
    await category.save();

    res.status(200).json(category);
}

//updateCategory

const updateCategory = async (req, res) => {

    const { id } = req.params;
    const {status, user, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    //TODO Validate with DB

    const category = await Category.findByIdAndUpdate(id, data, {new: true}).populate('user');

    res.json(category);
};

//deleteCategory - status: false

const deleteCategory = async (req, res) => {
    const {id} = req.params;
    //Delete physically
    //const user = await User.findByIdAndDelete(id);

    const category = await Category.findByIdAndUpdate(id, {status:false}, {new: true});

    res.json({
        category
    });
};
module.exports = {
    getCategories,
    getCategory,
    updateCategory,
    createCategory,
    deleteCategory
}