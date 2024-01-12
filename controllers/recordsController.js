const {connectionRequest} = require("../utils")

exports.getRecord = async (request, response, next) => {
    try {
        const connection = await connectionRequest()
        const param = request.query
        
        const sqlQuerySelect = `SELECT m.person_id,
                CONCAT(
                    p.last_name,
                    ', ',
                    p.first_name,
                    IF(LENGTH(p.middle_name) > 0, CONCAT(' ', p.middle_name), '')
                ) AS person_name,
                m.date_of_access, m.time_of_access, m.location_id, l.location_name, m.temperature `
        const sqlCountSelect = `SELECT COUNT(*) as count `
        const sqlFrom = `FROM main_record m
            JOIN person p ON m.person_id = p.person_id
            JOIN location l ON m.location_id = l.location_id `

        var sqlQuery = sqlQuerySelect + sqlFrom
        var sqlCount = sqlCountSelect + sqlFrom

        if (param.searchBy && param.searchKey) {
            var sqlWhere = ""
            if (param.searchBy.toLowerCase() === "person_id") {
                sqlWhere = `WHERE m.person_id LIKE '%${param.searchKey}%' `
            }
            if (param.searchBy.toLowerCase() === "person_name") {
                sqlWhere = `WHERE CONCAT(p.first_name, ' ', p.middle_name, ' ', p.last_name) LIKE '%${param.searchKey}%' `
            }

            if (param.searchBy.toLowerCase() === "date_of_access") {
                sqlWhere = `WHERE m.date_of_access = '${param.searchKey}' `
            }

            if (param.searchBy.toLowerCase() === "location_id") {
                sqlWhere = `WHERE m.location_id LIKE '%${param.searchKey}%' `
            }

            if (param.searchBy.toLowerCase() === "location_name") {
                sqlWhere = `WHERE l.location_name LIKE '%${param.searchKey}%' `
            }
            sqlQuery += sqlWhere
            sqlCount += sqlWhere
        }

        var orderBy = "date_of_access DESC, time_of_access DESC, person_name DESC"
        if (param.orderBy && param.order) {
            if (param.orderBy === "date_of_access") {
                orderBy = `date_of_access ${param.order}, time_of_access DESC`
            } else {
                orderBy = `${param.orderBy} ${param.order}`
            }
        }
        sqlQuery += `ORDER BY ${orderBy} `

        sqlQuery += `LIMIT 10 `

        if (param.page) {
            sqlQuery += `OFFSET ${(param.page - 1) * 10}`
        }

        console.log(sqlQuery)
        console.log(sqlCount)

        const [results] = await connection.query(sqlQuery)
        const [totalRecords] = await connection.query(sqlCount)

        var msgObj = {}
        var statusCode = 200

        if (results !== null) {
            msgObj.totalRecords = totalRecords[0].count
            msgObj.results = results
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

