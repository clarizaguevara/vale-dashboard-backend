const {connectionRequest} = require("../utils")

exports.getPerson = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `SELECT * FROM person `

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

        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.addPerson = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        
        var sqlQuery = `INSERT INTO person SET ?`

        const [results] = await connection.query(sqlQuery, request.body)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record added successfully." }
        } else {
            msgObj = { msg: "Record not inserted." }
            statusCode = 500
        }

        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.updatePerson = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        console.log(param)
        
        var sqlQuery = `UPDATE person SET ? WHERE id = ${param.id}`

        const [results] = await connection.query(sqlQuery, request.body)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record updated successfully." }
        } else {
            msgObj = { msg: "Record not updated." }
            statusCode = 500
        }

        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}

exports.deletePerson = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `DELETE FROM person WHERE id = ${param.id}`

        const [results] = await connection.query(sqlQuery)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj = { msg: "Record deleted successfully." }
        } else {
            msgObj = { msg: "Record not deleted." }
            statusCode = 500
        }

        response.status(statusCode).send(msgObj)

    } catch (err) {
        console.error('Error executing query: ', err)
        response.status(500).send({ error: err.message })
    }
}
