// Router
const express = require("express")
const router = express.Router();
const {User, Movie} = require("../models")
const bcrypt = require("bcrypt")
const salt = bcrypt.genSaltSync(10)
const jwt = require("jsonwebtoken")
const SECRET_KEY = "secret"

const {authentication, authorization} = require("../middlewares/auth.js")
const userController = require("../controllers/userController.js")
const movieController = require("../controllers/movieController.js")




// User
// ---> feature Register user baru
router.post("/register", async(req, res, next) => {
    
    // Menerima input data email,username sama password
    const {email, username, password} = req.body;
    



    //Password kemudian di hash menggunakan bcrypt
    const hashPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
        email,
        username,
        password: hashPassword
    }, {returning: true})

    res.status(201).json(createdUser)

})

// ---> Feature Login User
router.post("/login", async(req, res, next) => {
    try {
        const {email, password} = req.body;


        // 1. Cari user di database
        const foundUser = await User.findOne({
            where: {
                email
            }
        })

        if(foundUser) {

        // 2. Check password
        const comparePassword = bcrypt.compareSync(password, foundUser.password)

        if(comparePassword) {

            // Generate token menggunakan jsonwebtoken
            const accessToken = jwt.sign({
                email: foundUser.email,
                username: foundUser.username
            }, SECRET_KEY)

        
            res.status(200).json({
                message: "Login Successfully",
                
                    email: foundUser.email,
                    username: foundUser.username,
                    accessToken

                
            })
        

        }

        } else {
            throw {name: "InvalidCredentials"}
        }
        
    } catch(err) {
        console.log(err)
        // Masuk ke middleware selanjutnya
        next(err)

    }

})

// Pengecekan login atau belum
router.use(authentication)


router.use(authentication)
// Movies

router.post("/movies", async(req, res, next) => {
    try {
        const {tittle, year, languages} = req.body;
        const {id} = req.loggedUser

        const movie = await Movie.create({
            tittle,
            year,
            languages,
            user_id: id
        }, {returning: true})

        res.status(201).json({
            message: "Movie created successfully",
            data: movie
        })
    } catch(err) {
        next(err)
    }
})

// List All Movies
router.get("/movies", async(req, res, next) => {
    try {

        const movies = await Movie.findAll()

        res.status(200).json(movies)

    } catch(err) {
        next(err)
    }
})

// Get Movie Detail by ID
router.get("/movies/:id", async(req, res, next) => {
    try {
        const {id} = req.params;

        const foundMovie = await movie.findOne({
            where: {
                id
            }
        })

        if(foundMovie) {
            res.status(200).json(foundMovie)

        } else {
            throw {name: "ErrorNotFound"}
        }

    } catch(err) {
        next(err)
    }

})


// Update Movie by ID


// Tidak bisa update / delete Movie Milik orang lain
// haurs ada authorization

router.put("/movies/:id", authorization, async(req, res, next) => {
    try {
        const {id} = req.params;
        const {tittle, year, languages} = req.body;

        const foundMovie = await Movie.findOne({
            where: {
                id 
            }
        })

        if(foundMovie) {
            const updatedMovie = await foundMovie.update ({
                tittle: tittle || foundMovie.tittle,
                year: year || foundMovie.year,
                languages: languages|| foundMovie.languages

            }, {returning: true})

            res.status(200).json({
                message: "Movie Updated Succesyfully",
                data : updatedMovie
            })

        } else {
            throw {name: "ErrorNotFound"}
        }

    } catch(err) {
        next(err);
    }
})

router.delete("/movies/:id", authorization, async (req, res, next) =>{
    try {
        const {id} = req.params;

        const foundMovie = await Movie.findOne({
            where: {
                id
            }
        })

        if(foundMovie) {
            await foundMovie.destroy()

            res.status(200).json({
                message: "Movie deleted succesfully"
            })

        } else {
            throw {name: "ErrorNotFound"}
        }



    } catch(err) {
        next(err);
    }
})

// Fungsi untuk mengambil daftar pengguna dengan paginasi
router.get('/users', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Batasan 10 pengguna per halaman

    const users = await userController.getUsersWithPagination(page, limit);

    res.json(users);
});

// Rute untuk mengambil daftar film dengan paginasi
router.get('/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Batasan 10 film per halaman

    const movies = await movieController.getMoviesWithPagination(page, limit);
    res.json(movies);
});
module.exports = router;
