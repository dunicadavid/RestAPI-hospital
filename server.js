require("dotenv").config();

const express = require('express');
const helmet = require('helmet');
const http = require('http');

const app = express();

//middleware

app.use(helmet());
app.use(express.json());

app.use("/employee",require("./routes/employeeRoutes"));
app.use("/pacient",require("./routes/pacientRoutes")); 
app.use("/treatment",require("./routes/treatmentRoutes"));


app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);

    res.status(500).json({
        message: "Something went wrong",
    });
});


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});