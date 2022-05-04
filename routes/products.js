const { Router } = require('express');
const { check } = require('express-validator');
const {validateJWT} = require('../middlewares/validate-jwt');
const validateFields = require('../middlewares/validate-fields');
const { hasRole, isAdminRole } = require('../middlewares');
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/products');
const { categoryByIdExists, productByIdExists } = require('../helpers/db-validators');


const router = Router();

/**
 * {{url}}/api/products
 */

//Get all categories - public
router.get('/', getProducts);

//Get one product by ID - public
router.get('/:id', [
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(productByIdExists),
    validateFields
],
getProduct);

//Create product - private - anyone with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Not a valid ID').isMongoId(),
    check('category').custom(categoryByIdExists),
    validateFields
], createProduct);

//Update -private -anyone with valid token
router.put('/:id', [
    validateJWT,
    //check('category', 'Not a valid ID').isMongoId(),
    check('id').custom(productByIdExists),
    validateFields
],
updateProduct);

//Delete category - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(productByIdExists),
    validateFields
], deleteProduct);

module.exports = router;