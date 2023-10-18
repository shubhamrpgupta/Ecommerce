const mongoose = require("mongoose")
const dotenv = require("dotenv")


dotenv.config({ path: "backend/config/config.env" })

const connectDatabase = () => {
    main().catch(err => console.log(`Mongo ERROR, ${err}`));
    async function main() {
        await mongoose.connect("mongodb://127.0.0.1:27017/ShoppingWebsite");
        console.log("MONGO CONNECTION OPEN!!")
    }
}

module.exports = connectDatabase;