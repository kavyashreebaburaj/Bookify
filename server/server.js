const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();
const dbConfig = require("./config/dbConfig")
const port = process.env.PORT || 5001;
const userRoute = require("./routes/usersRoute")
app.use("/api/users",userRoute);
app.listen(port,() => console.log(`Node Server started at ${port}`));