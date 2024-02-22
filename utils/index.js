const bcrypt=require("bcrypt")

const hashPassword = password => {
    const saltRounds = process.env.SALT_ROUNDS;
    return bcrypt.hashSync(password, Number(saltRounds));
};
const comparePassword = (providedPassword, storedHashedPassword) => {
    return bcrypt.compareSync(providedPassword, storedHashedPassword);
};
const isEmpty = arr => {
    return arr.length === 0;
};
const validateFields = (req, requiredFields) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    return missingFields;
};
const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};
const validatePassword = password => {
    // Password must be at least 8 characters long and contain at least one capital letter and one digit
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
};
const formatDateTime = (dateTime, options = null) => {
    const defaultOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const mergedOptions = { ...defaultOptions, ...options };
    return dateTime.toLocaleString('en-US', mergedOptions);
};
const generateToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const sendEmail = async (toEmail, toName, token, baseUrl) => {
    console.log({ toEmail, toName, token, baseUrl });
};
const isLoggedIn = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res.status(401).json({ message: 'Unauthorized - User not logged in' });
    }
    next();
};
const validateUrl=(value)=> {
    const urlRegex = /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z]{2,})))(?::\d{2,5})?(?:\/[^\\s]*)?$/i;
    
    return urlRegex.test(value);
  }
module.exports={
    validateUrl,isLoggedIn,formatDateTime,validateEmail,validateFields,validatePassword,isEmpty,hashPassword,comparePassword,sendEmail,generateToken
}