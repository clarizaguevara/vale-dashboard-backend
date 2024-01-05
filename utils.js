const jwt = require("jsonwebtoken")
const mySQLClient = require("mysql2/promise")

exports.validateToken = (request, response, next)  => {
    const authorizationHeader = request.headers.authorization
    if (authorizationHeader) {
        const token = authorizationHeader.split(" ")[1] // Bearer <token>
        const secret = process.env.SECRET_KEY
        const options = {/*expiresIn:"2d",*/issuer:"http://localhost"}
        jwt.verify(token, secret, options, (err, result) => {
            if (err) {
                response.status(402).send({err:err})
            }
            else {
                // add the decoded value to the request object
                request.decoded = result
                next()
            }
        })
    } else {
        response.status(201).send({msg:"Authentication error, Token required"})
    }

}

exports.connectionRequest = () => {
    return mySQLClient.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dateStrings: true,
    })
}