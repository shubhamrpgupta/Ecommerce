const app = require("./app");
const dotenv = require("dotenv")
const connectDatabase = require("./database/mongoDB")

//Handling uncaught Exception 
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})


//config

dotenv.config({ path: "backend/config.env" })

//connectiong to databse
connectDatabase()


const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`)
})



//unhandled Promise Rejection 
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(() => {
        process.exit(1);
    });
})