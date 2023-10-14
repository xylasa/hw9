const jwt = require ("jsonwebtoken")
const SECRET_KEY = "secret"
const {User, Movie} = require("../models")
// Mengecek apakah user sudah login / belom
const authentication = async (req, res, next) => {
    try {

        //Verify token dengan jwt
        if(!req.headers.authorization) {
            throw {name: "Unauthenticated"}
        }
        const token = req.headers.authorization.split(" ")[1];
        

        //decode token
        const decoded = jwt.verify(token, SECRET_KEY);

        const foundUser = await User.findOne({
            where: {
                email: decoded.email
            }
        })

        if(foundUser) {
            
            // Buat custom property di request

            req.loggedUser = {
                id: foundUser.id,
                email: foundUser.email,
                username: foundUser.username
            }

            // Masuk ke middleware selanjutnya

            next()
        } else {
            throw {name: "Unathenticated"}

        }
    } catch (err) {
        
        next(err);

    }

} 

// Pengecekan Setelah login
const authorization = async (req, res, next) => {
    try {

        // Movie id
        const {id} = req.params;

        const foundMovie = await Movie.findOne({
            where: {
                id
            }
        })

        if(foundMovie) {

            const loggedUser = req.loggedUser
            if(foundMovie.user_id === loggedUser.id) {

        } else {
            throw {name: "Unauthorized"}

        }
        } else {
            throw {name: "ErrorNotFound"}
        }

    } catch(err) {
        next(err)
    }

}

module.exports = {
    authentication,
    authorization
}