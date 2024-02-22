const express=require("express");
const cors=require("cors");
const app=express();
const db=require("./models")
const corsOptions={
    origin:"http://localhost:8081",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
db.sequelize.sync()
.then(()=>{
    console.log("Synced to db");
})
.catch((err)=>{
    console.log("failed to sync to db: "+err.message)
})
const port=process.env.PORT||8080;
app.listen(port,()=>{
    console.log(`server is up and running on port ${port}`);
})
require("./routes/auth.routes")(app)
require("./routes/shortUrls.routes")(app)