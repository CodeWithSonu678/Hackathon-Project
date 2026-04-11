require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db_connect");

connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server is running on port number ${PORT}`);
})