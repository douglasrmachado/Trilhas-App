"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
const config_1 = require("./config");
const pool = (0, promise_1.createPool)({
    host: config_1.config.database.host,
    port: config_1.config.database.port,
    user: config_1.config.database.user,
    password: config_1.config.database.password,
    database: config_1.config.database.database,
    connectionLimit: config_1.config.database.connectionLimit,
});
// Event listeners para monitoramento da conexão
pool.on('connection', (connection) => {
    console.log('🔗 Nova conexão estabelecida com o banco de dados');
});
pool.on('enqueue', () => {
    console.log('⏳ Aguardando conexão disponível no pool');
});
exports.default = pool;
//# sourceMappingURL=db.js.map