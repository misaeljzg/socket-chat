const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { json } = require('express/lib/response');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const User = require('../models/user');
const login = async (req, res = response) => {

    const { mail, password } = req.body;

    try {

        //Verify if mail exists
        const user = await User.findOne({mail});
        if(!user){
            return res.status(400).json({
                msg: 'User / Password incorrect - mail'
            });
        }

        //User is still active
        if(!user.status){
            return res.status(400).json({
                msg: 'User / Password incorrect - status: false'
            });
        }

        //Verify Password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'User / Password incorrect - password'
            });
        }

        //Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Reach your administrator'
        })
    }


}

const googleSignIn = async(req, res = response) => {
    const { id_token } = req.body;


    try {
        const {name, img, mail} = await googleVerify(id_token);

        let user = await User.findOne({mail});

        //User does not exist 
        if(!user) {
            const data = {
                name,
                mail,
                password: ':P',
                img,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        //If user is disabled in DB 
        if(!user.status) {
            return res.status(401).json({
                msg: 'Talk to the admin, user blocked'
            });
        }

        //Generate JWT
        const token = await generateJWT(user.id);



        res.json({
            user,
            token
        })
    } catch (error) {
        json.status(400)({
            ok: false,
            msg: 'Token could not be verified'
        })
    }
}

const renewToken = async (req, res = response) => {

    const {user } = req;

    //Generate new JWT to prolong the users time in server

    const token = await generateJWT(user.id);

    res.json({
        user,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}