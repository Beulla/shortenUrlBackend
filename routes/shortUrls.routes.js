module.exports=app=>{
    const urls=require("../controllers/shortenUrl.controller")
    var router=require("express").Router()
    router.post("/short",urls.shortenUrl)
    router.get("/:shortUrl",urls.redirect)
    router.delete("/:shortUrl",urls.deleteUrl)
    router.get("all/:email",urls.getAll)
    app.use("/api/url",router)
}