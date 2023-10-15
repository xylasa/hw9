const express = require('express')
const app = express()
const port = 3000
const router = require("./routes")
const errorHandler = require("./middlewares/errorHandler.js")
const morgan = require("morgan")



app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(router);

// Morgan
app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));



// error handling
app.use(errorHandler)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})