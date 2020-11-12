const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const morgan = require("morgan");

// initialize
const app = express();

// settings
app.set("port", process.env.PORT || 5000);
require('dotenv').config();

// middleares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: false,
        parameterLimit: 50000
    })
);

// routes
const {
    ProjectRoutes,
    ForgeRoutes,
    TaskRoutes
} = require('./src/routes/index.routes');

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Forge Hackathon API'
    });
});
app.use('/project', ProjectRoutes);
app.use('/forge', ForgeRoutes);
app.use('/task', TaskRoutes);

//start the server
const server = app.listen(app.get("port"), (req, res) => {
    console.log("Server on port: ", `http://localhost:${app.get("port")} `);
});