const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const {validateFields, validateJWT} = require('../middlewares');

const router = Router();

router.post('/login', [
    check('mail', 'mail is needed').isEmail(),
    check('password', 'Password is needed').not().isEmpty(),
    validateFields
] ,login);

router.post('/google', [
    check('id_token', 'id_token is needed').not().isEmpty(),
    validateFields
] ,googleSignIn);

router.get('/', validateJWT, renewToken);

module.exports = router;