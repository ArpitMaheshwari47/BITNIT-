require('dotenv').config()
const helper = require("../helper/helper");
const jwt = require("jsonwebtoken");


// Middleware function to authenticate requests
const authenticate = (req, res, next) => {
    try {
        // Get authorization header from the request
        const authHeader = req.headers.authorization || req.headers.Authorization;
        // If authorization header doesn't start with "Bearer", return 401 Unauthorized response
        if (!authHeader?.startsWith('Bearer')) return helper.sendError(res, {}, 'Invalid request!', 401);

        // Get token from authorization header
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token)
        // If token is not present, return 401 Unauthorized response
        if (!token) {
            return helper.sendError(res, {}, "Invalid Token", 401);
        }
        // Verify token using the JWT_SECRET from environment variables
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {

            //console.log('decoded' , decode);
            // If token is invalid, return 403 Forbidden response
            if (err) return helper.sendError(res, {}, "Token expired", 401);
            // If token is valid, set the decoded user ID as a request parameter and call next middleware
         req.headers.userId = decode._id;
           next();
        });
    } catch (err) {
        // If there's an error, return 500 Internal Server Error response
        return helper.sendServerError(res, err);
    }
};

module.exports= {authenticate}