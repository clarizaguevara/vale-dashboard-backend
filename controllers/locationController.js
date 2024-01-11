const {connectionRequest} = require("../utils")

exports.getLocation = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `SELECT * FROM location `

        if (param.searchBy && param.searchKey) {
            sqlQuery += `WHERE ${param.searchBy} LIKE '%${param.searchKey}%' `
        }

        var orderBy = "id ASC"
        if (param.orderBy && param.order) {
            orderBy = `${param.orderBy} ${param.order}`
        }
        sqlQuery += `ORDER BY ${orderBy} `

        sqlQuery += `LIMIT 20 `

        if (param.page) {
            sqlQuery += `OFFSET ${(param.page - 1) * 20}`
        }

        console.log(sqlQuery)

        const [results] = await connection.query(sqlQuery)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = results
        } else {
            msgObj = { msg: "Record not found." }
            statusCode = 202
        }

        connection.close()
        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.addLocation = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        
        var sqlQuery = `INSERT INTO location SET ?`

        const [results] = await connection.query(sqlQuery, request.body)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record added successfully." }
        } else {
            msgObj = { msg: "Record not inserted." }
            statusCode = 500
        }

        connection.close()
        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.updateLocation = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `UPDATE location SET ? WHERE id = ${param.id}`

        const [results] = await connection.query(sqlQuery, request.body)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record updated successfully." }
        } else {
            msgObj = { msg: "Record not updated." }
            statusCode = 500
        }

        connection.close()
        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.deleteLocation = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `DELETE FROM location WHERE id = ${param.id}`

        const [results] = await connection.query(sqlQuery)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record deleted successfully." }
        } else {
            msgObj = { msg: "Record not deleted." }
            statusCode = 500
        }

        connection.close()
        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}