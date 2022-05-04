const { response } = require("express");

const {Product} = require('../models');

//getProducts -paginate - total- populate

const getProducts = async (req, res ) => {
    const {limit = 5, from = 0} = req.query;

    const query = {status : true};

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query).skip(from).limit(limit).populate('user', 'name').populate('category', 'name')  
    ]);

    res.json({total, products});
};

//getProduct - populate

const getProduct = async  (req, res) => {
    const {id} = req.params;

    const product = await Product.findById(id).populate('user', 'name').populate('category', 'name');

    res.json(product);
};

/**
 * Create Product
 */

const createProduct = async (req, res=response) => {

    const {status, user, ...body} = req.body;

    const productDB = await Product.findOne({name: body.name});

    if(productDB) {
        return res.status(400).json({
            msg: `Product ${productDB.name} already exists`
        });
    }

    //Generate data to store

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    const product = new Product(data);

    //Store in db
    await product.save();

    res.status(200).json(product);
}

//updateProduct

const updateProduct = async (req, res) => {

    const { id } = req.params;
    const {status, user, ...data} = req.body;

    if(data.name){
        data.name = data.name.toUpperCase();
    }
    data.user = req.user._id;

    //TODO Validate with DB

    const product = await Product.findByIdAndUpdate(id, data, {new: true});

    res.json(product);
};

//deleteProduct - status: false

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    //Delete physically
    //const user = await User.findByIdAndDelete(id);

    const deletedProduct = await Product.findByIdAndUpdate(id, {status:false}, {new: true});

    res.json({
        deletedProduct
    });
};
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}