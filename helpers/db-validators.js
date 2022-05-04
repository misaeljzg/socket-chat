const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`The role ${role} is not register in DB`)
    }
};


const mailExists = async (mail = '') => {
    const exists = await User.findOne({ mail });
    if (exists) {
        throw new Error(`The email ${mail} already exists in DB`)
    }
};

const userByIdExists = async (id) => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`The id ${id} does not exist in DB`)
    }
};

const categoryByIdExists = async (id) => {
    const categoryExists = await Category.findById(id);
    if (!categoryExists) {
        throw new Error(`The category with id ${id} does not exist in DB`)
    }
};

const productByIdExists = async (id) => {
    const productExists = await Product.findById(id);
    if (!productExists) {
        throw new Error(`The product with id ${id} does not exist in DB`)
    }
};

module.exports = {
    isRoleValid,
    mailExists,
    userByIdExists,
    categoryByIdExists,
    productByIdExists
};