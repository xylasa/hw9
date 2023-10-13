// Router
const express = require("express")
const router = express.Router();
const {user, movie} = require("../models")
const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

// User
// ---> feature Register user baru
router.post("/register", async(req, res, next) => {
    
    // Menerima input data email,username sama password
    const {email, username, password} = req.body;
    console.log(req.body);


    console.log(salt)
    //Password kemudian di hash menggunakan bcrypt
    const hashPassword = bcrypt.hashSync(password, salt);
    console.log(hashPassword, "<<<<<")



})

// Movies


module.exports = router;
