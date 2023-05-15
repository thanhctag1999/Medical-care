const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv/config");
const routers = require("./routers/api");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const originAllow = "http://localhost:3000";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(
  cors({
    origin: originAllow,
  })
);

const io = new Server(server, {
  cors: {
    origin: originAllow,
  },
});

io.on("connection", (socket) => {
  socket.on("subscribe-notification", (userId) => {
    socket.join(userId);
  });

  socket.on("send_notification", async (data) => {
    console.log("data", data.supervisor._id, data.assigner._idv);
    io.to(data.supervisor._id).emit("receive_notification", data);
    io.to(data.assigner._id).emit("receive_notification", data);
  });
});

let allowCrossDomain = function (req, res, next) {
  res.header("Cross-Origin-Resource-Policy", originAllow);
  next();
};

app.use(allowCrossDomain);

app.use(express.json());

const clientDir = path.resolve(__dirname, "uploads");
app.use(express.static(clientDir));

//routers
app.use("/api", routers);

// DB connection
mongoose.connect("mongodb://0.0.0.0:27017/medical", () => {
  console.log("connected to DB !");
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`🚀 Server ready `);
});
