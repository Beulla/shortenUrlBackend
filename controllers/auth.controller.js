const db=require("../models")
const User=db.User
const Tokens=db.tokens
require('dotenv').config();
const jwt=require("jsonwebtoken")
const{
    validateEmail,
    validateFields,
    validatePassword,
    isEmpty,
    hashPassword,
    comparePassword,
    sendEmail,
    generateToken
}=require("../utils")
const logger=require("../loggerConfigs")

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const requiredFields=['email','password']
        const missingFields=validateFields(req,requiredFields);
        if(missingFields.length>0){
            logger.error(
                `Adding User:Required fields are missing:${missingFields.join(', ')}`
            )
            return res.status(400).json({
                ok:false,
                message:`Required fields are missing:${missingFields.join(', ')}`
            })
        }
        if (!validateEmail(email)) {
            logger.error(`Adding User: Invalid email:${email}`);
            return res.status(400).json({
              ok: false,
              message: 'Invalid credentials',
              info: 'The email should follow the following pattern xxx@xxx.xxx',
            });
        }
        if (!validatePassword(password)) {
            logger.error(`Adding User: Invalid password`);
            return res.status(400).json({
              ok: false,
              message: 'Invalid credentials',
              info: 'Password must be at least 8 characters long and contain at least one capital letter and one digit',
            });
        }
        let findUser=await User.findOne({where:{email:req.body.email}})
        if(!findUser){
            logger.error(`Login-email: Invalid credentials from ${email}`);
            return res.status(401).json({
                ok: false,
                message: 'Invalid credentials.',
            });
        }
        const comparedHashedPassword = comparePassword(password, findUser.password);

        if (!comparedHashedPassword) {
        logger.error(`Login-pw: Invalid credentials from ${email}`);
        return res.status(401).json({
            ok: false,
            message: 'Invalid credentials.',
        });
        }
        const secretKey=process.env.SECRET
        const payload={
            userId:req.body.email,
            exp:Math.floor(Date.now()/1000)+3*60*60
        }
        let token=jwt.sign(payload,secretKey)
        let id=findUser.id
        res.send({token,id}).status(200);
    }
    catch (error) {
        logger.error(`Login: ${error.message}`);
        return res.status(500).json({
          ok: false,
          message: 'An error occurred during login.',
        });
    }
}
const signUp=async(req,res)=>{
    try{
        const {email,password}=req.body
        const requiredFields=['email','password']
        const missingFields=validateFields(req,requiredFields)
        if (missingFields.length > 0) {
            logger.error(
              `Adding User:Required fields are missing:${missingFields.join(', ')}`
            );
            return res.status(400).json({
              ok: false,
              message: `Required fields are missing: ${missingFields.join(', ')}`,
            });
        }
        if (!validateEmail(email)) {
            logger.error(`Adding User: Invalid email:${email}`);
            return res.status(400).json({
              ok: false,
              message: 'Invalid email format',
            });
        }
        if (!validatePassword(password)) {
            logger.error(`Adding User: Invalid password`);
            return res.status(400).json({
              ok: false,
              message:
                'Password must be at least 8 characters long and contain at least one capital letter and one digit',
            });
        }
        let findUser=await User.findOne({where:{email:req.body.email}})
        if (findUser) {
            logger.error(`Adding User: User with email:${email} exists`);
            return res.status(409).json({
                ok: false,
                message: `User with this email:${email} already exists.`,
            });
        }
        const hashedPassword=hashPassword(password)
        const user = {
            email: req.body.email,
            password: hashedPassword
        };
        const createdUser =User.create(user);
        if(createdUser){
          res.status(200).json({
            ok:true,
            message:'Login to proceed'
          })
        }
        
    }
    catch(error){
        logger.error(`Adding a user: ${error.message}`);
        return res.status(500).json({
        ok: false,
        message: 'An error occurred while adding the user.',
        });
    }
}
const forgotPassword=async(req,res)=>{
    console.log(req.body)
    const findUser=await Users.findOne({where:{email:req.body.email}})
    if(findUser){
      await Tokens.update({
        used:1
      },{where:{email:req.body.email}})
      var fpSalt=crypto.randomBytes(64).toString('base64')
      var expireDate=new Date(new Date().getTime()+(60*60*1000))
      await Tokens.create({
        email:req.body.email,
        expiration:expireDate,
        token:fpSalt,
        used:0
      })
      const transporter=nodemailer.createTransport({
        
        service:'outlook',
        auth:{
          user:process.env.YOUR_EMAIL,
          pass:process.env.EMAIL_PASSWORD
        }
      })
      let mailOptions={
        from:process.env.YOUR_EMAIL,
        to:req.body.email,
        subject:"password reset",
        text:'To reset your password, please click the link below. \n\n http://localhost:3000'+'/reset?token='+encodeURIComponent(fpSalt)+'&email='+req.body.email
      }
      await transporter.sendMail(mailOptions,function(err,info){
        if(err){
          console.log(err)
        }
        else{
          console.log("Email sent"+info.response)
          res.send({message:fpSalt})
        }
      })
    }
    else{
      res.send({message:"Request denied"})
    }
    
  }
  
  const resetPassword=async(req,res)=>{
    console.log(req.body)
    await Tokens.destroy({where:{expiration:{[Op.lt]:Sequelize.fn('CURDATE')}}})
    let record=await Tokens.findOne({where:{
      email:req.body.email,
      expiration:{[Op.gt]:Sequelize.fn('CURDATE')},
      token:req.body.token,
      used:0
    }})
    if(record==null){
      res.send({message:"Token has expired. Please try password reset again"})
    }
    else{
      if(req.body.password1!==req.body.password2){
        return res.json({status:'error',message:"Passwords do not match, please try again"})
      }
      else{
        console.log("sucess")
        await Tokens.update({
          used:1
        },{where:{email:req.body.email}})
        let hashNewPassword=await argon2.hash(req.body.password1)
        await Users.update({
          password:hashNewPassword
        },{where:{email:req.query.email}})
        res.send({message:"Successfully reset password"})
      }
    }
  }
  
module.exports={
    signUp,login,forgotPassword,resetPassword
}