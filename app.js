const express = require('express');
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();




const app = express();

const port = process.env.PORT;


const authRouter = require("./src/routes/auth");
const projectRouter=require("./src/routes/project")
const taskRouter=require("./src/routes/task")
const organisationRouter=require("./src/routes/organisation")
const profileRouter=require("./src/routes/profile");
const categoryRouter = require('./src/routes/category');
const tagRouter = require('./src/routes/tag');
const aggregateRouter = require('./src/routes/aggregate');
const remarkRouter = require('./src/routes/remark');
const contractorRouter = require('./src/routes/contractor');
const attendanceRouter = require('./src/routes/attendance');



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FE_ORIGIN,
    credentials: true, 
     methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));


app.use("/", authRouter);
app.use("/",projectRouter)
app.use("/",taskRouter);
app.use("/",organisationRouter);
app.use("/",profileRouter)
app.use("/",categoryRouter)
app.use("/",tagRouter)
app.use("/",aggregateRouter)
app.use("/",remarkRouter)
app.use("/",contractorRouter)
app.use("/",attendanceRouter)


app.get('/', (req, res) => {
  res.send('successful');
});


connectDB()
    .then(() => {
        console.log("DB Connection successfully");
        app.listen(port, () => {
            console.log(`Server connected on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
    });
