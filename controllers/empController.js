var Employees = require("../model/employees")
const { MongoClient } = require("mongodb")

const uri = "mongodb://127.0.0.1:27017/"
const db_name = "vale_poc"
const collection_name = "employee_access"

const mongoClient = new MongoClient(uri, { useUnifiedTopology: true })

exports.getAll = async (request, response, next) => {
    try {
        var client = await mongoClient.connect()
        var dbName = client.db(db_name)
        var colName = dbName.collection(collection_name)

        var cursor = colName.find()

        var empArr = []
        await cursor.forEach(element => {
            empArr.push(element);
        })

        mongoClient.close()
        response.status(200).send(empArr)
    }
    catch (err) {
        mongoClient.close()
        response.status(500).send({err: `${err}`})
    }
}

exports.getEmployee = async (request, response, next) => {
    try {
        var client = await mongoClient.connect()
        var dbName = client.db(db_name)
        var colName = dbName.collection(collection_name)

        var empId = parseInt(request.params.empId)
        var searchObj = {empId: empId}
        colName.findOne(searchObj)
            .then(res => {
                var msgObj = {}
                var statusCode = 200

                if (res !== null) {
                    msgObj = res
                } else {
                    msgObj = {msg: "Employee not found."}
                    statusCode = 202
                }
                mongoClient.close()
                response.status(statusCode).send(msgObj)
            })
            .catch(err => {
                mongoClient.close()
                response.status(500).send({err: `${err}`})
            })
    }
    catch (err) {
        mongoClient.close()
        response.status(500).send({err: `${err}`})
    }
}

exports.addEmployee = async (request, response, next) => {
    try {
        var client = await mongoClient.connect()
        var dbName = client.db(db_name)
        var colName = dbName.collection(collection_name)

        colName.insertOne(request.body)
            .then(res => {
                mongoClient.close()
                response.status(200).send({msg: `Employee added successfully! Inserted Id: ${res.insertedId}`})
            })
            .catch(err => {
                mongoClient.close()
                response.status(500).send({err: `${err}`})
            })
    }
    catch (err) {
        mongoClient.close()
        response.status(500).send({err: `${err}`})
    }
}

exports.updateEmployee = async (request, response, next) => {
    try {
        var client = await mongoClient.connect()
        var dbName = client.db(db_name)
        var colName = dbName.collection(collection_name)

        var body = request.body
        var filterObj = {empId: parseInt(request.params.empId)}
        var updateObj = {$set: new Employees(body.empId, body.empName, body.timeIn, body.temperature)}
        colName.updateMany(filterObj, updateObj)
            .then(res => {
                var msgObj = {}
                var statusCode = 200

                if (res.matchedCount === 0) {
                    msgObj = {msg: "No employees modified."}
                    statusCode = 202
                } else if (res.matchedCount > 0 && res.modifiedCount === 0) {
                    msgObj = {msg: `No modifications made. Number of matched employees: ${res.matchedCount}`}
                    statusCode = 202
                } else if (res.modifiedCount > 0) {
                    msgObj = {msg: `Found ${res.matchedCount} employees. ${res.modifiedCount} employees updated successfully!`}
                }
                mongoClient.close()
                response.status(statusCode).send(msgObj)
            })
            .catch(err => {
                mongoClient.close()
                response.status(500).send({err: `${err}`})
            })
    }
    catch (err) {
        mongoClient.close()
        response.status(500).send({err: `${err}`})
    }
}

exports.deleteEmployee = async (request, response, next) => {
    try {
        var client = await mongoClient.connect()
        var dbName = client.db(db_name)
        var colName = dbName.collection(collection_name)

        var filterObj = {empId: parseInt(request.params.empId)}
        colName.deleteMany(filterObj)
            .then(res => {
                var msgObj = {}
                var statusCode = 200

                if (res.deletedCount > 0) {
                    msgObj = {msg: `Employees deleted successfully! Number of employees deleted: ${res.deletedCount}`}
                } else if (res.deletedCount === 0) {
                    msgObj = {msg: "No employees deleted."}
                    statusCode = 202
                }
                mongoClient.close()
                response.status(statusCode).send(msgObj)
            })
            .catch(err => {
                mongoClient.close()
                response.status(500).send({err: `${err}`})
            })
    }
    catch (err) {
        mongoClient.close()
        response.status(500).send({err: `${err}`})
    }
}

