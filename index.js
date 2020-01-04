const server = require("./backend/server").server;
const PORT = process.env.PORT || 3000;
server.start(PORT);