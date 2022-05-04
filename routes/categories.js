const { Router } = require('express');
const { check } = require('express-validator');
const {validateJWT} = require('../middlewares/validate-jwt');
const validateFields = require('../middlewares/validate-fields');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryByIdExists } = require('../helpers/db-validators');
const { hasRole, isAdminRole } = require('../middlewares');


const router = Router();

/**
 * {{url}}/api/categories
 */

//Get all categories - public
router.get('/', getCategories);

//Get one category by ID - public
router.get('/:id', [
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(categoryByIdExists),
    validateFields
],
getCategory);

//Create category - private - anyone with a valid token
router.post('/', [
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    validateFields
], createCategory);

//Update -private -anyone with valid token
router.put('/:id', [
    validateJWT,
    check('id', 'Not a valid ID').isMongoId(),
    check('name', 'Name cannot be empty').not().isEmpty(),
    validateFields
],
updateCategory);

//Delete category - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(categoryByIdExists),
    validateFields
], deleteCategory);

module.exports = router;