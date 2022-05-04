const { response } = require("express");


const isAdminRole = (req, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            msg: 'Trying to validate role without validating token first'
        })
    }

    const {role, name} = req.user;

    if (role!= 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an admin - Cannot perform action`
        })
    }

    next();
}

const hasRole = (...roles) => {


    return (req, res = response, next) => {

        if(!req.user) {
            return res.status(500).json({
                msg: 'Trying to validate role without validating token first'
            });
        }

        if(roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Service requires either of these roles ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}