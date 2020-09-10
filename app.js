const express = require('express')
const dotenv = require('dotenv')
const path   = require('path')



//load config
dotenv.config({path:  path.join(__dirname,'config','config.env')})

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})
