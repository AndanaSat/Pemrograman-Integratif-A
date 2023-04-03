const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const mysql = require('mysql2')

const PROTO_PATH = './jadwal.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const itemProto = grpc.loadPackageDefinition(packageDefinition)

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "grpc",
    waitForConnections: true,
    connectionLimit: 10
});

const server = new grpc.Server()

server.addService(itemProto.ItemService.service, {
    getItem: (call, callback) => {
        const item_id = call.request.item_id;
        pool.query('SELECT * FROM items WHERE item_id = ?', [item_id], (error, result) => {
            if (error) {
                console.error(error);
                callback({ code: grpc.status.INTERNAL, message: "Internal Server Error" })
                return
            }
            else if (result.length === 0) {
                callback({ code: grpc.status.NOT_FOUND, message: "Item Not Found" })
                return
            }
            else {
                const itemData = results[0];
                const item = {
                    item_id: itemData.item_id,
                    description: itemData.description,
                    date: itemData.date 
                }
                callback(null, item)
            }
        })
    },
    
    addItem: (call, callback) => {
        const item_id = call.request.item_id
        const description = call.request.description
        const date = call.request.date
        pool.query('INSERT INTO items (item_id, description, date) VALUES (?, ?, ?)', [item_id, description, date], (error, result) => {
            if (error) {
                console.error(error)
                callback({ code: grpc.status.INTERNAL, message: "Internal Server Error" })
                return
            }
            else {
                const item = { item_id, description, date }
                callback(null, item)
            }
        })
    },
    
    updateItem: (call, callback) => {
        const item_id = call.request.item_id
        const description = call.request.description
        const date = call.request.date
        pool.query("UPDATE items SET description = ?, date = ? WHERE item_id = ?", [description, date, item_id], (error, result) => {
            if (error) {
                console.error(error)
                callback({grpc: grpc.status.INTERNAL, message: "Internal Server Error"})
                return
            }
            else {
                const item = { item_id, description, date }
                callback(null, item)
            }
        })
    },
    
    deleteItem: (call, callback) => {
        const item_id = call.request.item_id
        pool.query("DELETE FROM items WHERE item_id = ?", [item_id], (error, result) => {
            if (error) {
                console.error(error)
                callback({ grpc: grpc.status.INTERNAL, message: "Internal Server Error" })
                return
            }
            else{
                callback(null, {})
            }
        })
    }
})
server.bindAsync(
    '127.0.0.1:5000', 
    grpc.ServerCredentials.createInsecure(), 
    (error, port) => {
        console.log('Server running at http://127.0.0.1:5000');
        server.start();
  }
);