const {connectionRequest} = require("../utils")

exports.getRecord = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        var sqlQuery = `SELECT m.person_id,
                CONCAT(
                    p.last_name,
                    ', ',
                    p.first_name,
                    IF(LENGTH(p.middle_name) > 0, CONCAT(' ', p.middle_name), '')
                ) AS person_name,
                m.date_of_access, m.time_of_access, m.location_id, l.location_name, m.temperature
            FROM main_record m
            JOIN person p ON m.person_id = p.person_id
            JOIN location l ON m.location_id = l.location_id `

        if (param.searchBy && param.searchKey) {
            if (param.searchBy.toLowerCase() === "person_id") {
                sqlQuery += `WHERE m.person_id LIKE '%${param.searchKey}%' `
            }
            if (param.searchBy.toLowerCase() === "person_name") {
                sqlQuery += `WHERE CONCAT(p.first_name, ' ', p.middle_name, ' ', p.last_name) LIKE '%${param.searchKey}%' `
            }

            if (param.searchBy.toLowerCase() === "date_of_access") {
                sqlQuery += `WHERE m.date_of_access = '${param.searchKey}' `
            }

            if (param.searchBy.toLowerCase() === "location_id") {
                sqlQuery += `WHERE m.location_id LIKE '%${param.searchKey}%' `
            }

            if (param.searchBy.toLowerCase() === "location_name") {
                sqlQuery += `WHERE l.location_name LIKE '%${param.searchKey}%' `
            }
        }

        var orderBy = "date_of_access DESC, time_of_access DESC, person_name DESC"
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

exports.addRecord = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        
        var sqlQuery = `INSERT INTO main_record SET ?`

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

