const errorHandler = (err, req, res, next) => {
    console.log(err)


    
    if(err.name === "InvalidCredentials") {
        res.status(400).json({message: "Wrong Email or Password"})

    } else if(err.name === "Unauthenticated") {
        res.status(400).json({message: "Unauthenticated"})

    } else if(err.name === "JSONWebTokenError") {
        res.status(400).json({message: "Token Error"})
    } else if(err.name === "ErrorNotFound") {
        res.status(400).json({message: "Error Not Found"})
    } else if(err.name === "Unauthorized") {
        res.status(403).json({message: "Unauthorized"})
    }


    else {
            res.status(500).json({message: "Internal Server Error"})
        }

}
    

module.exports = errorHandler;