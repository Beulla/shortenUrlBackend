module.exports=app=>{
    const users=require("../controllers/auth.controller")
    var router=require("express").Router()
    router.post("/new",users.signUp)
    router.post("/login",users.login)
    router.post("/forgot",users.forgotPassword)
    router.post("/reset-password",users.resetPassword)
    app.use("/api/auth",router)
}