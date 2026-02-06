const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/sherise")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ================= MODEL ================= */
const visitorSchema = new mongoose.Schema({
  page: String,
  visitTime: { type: Date, default: Date.now }
});
const Visitor = mongoose.model("Visitor", visitorSchema);

/* ================= TRACK VISIT ================= */
app.post("/track", async (req, res) => {
  let { page } = req.body;

  // 🔹 clean page name
  page = page.split("/").pop();

  // 🔹 store visit (past data stays)
  await Visitor.create({ page });

  // 🔹 aggregate total visits till now
  const data = await Visitor.aggregate([
    { $group: { _id: "$page", count: { $sum: 1 } } }
  ]);

  // 🔹 emit ONLY when visit happens
  io.emit("updateGraph", data);

  res.sendStatus(200);
});

/* ================= SOCKET CONNECT ================= */
io.on("connection", async (socket) => {
  console.log("Dashboard connected");

  // 🔹 send existing totals ONCE
  const data = await Visitor.aggregate([
    { $group: { _id: "$page", count: { $sum: 1 } } }
  ]);

  socket.emit("updateGraph", data);
});

server.listen(5000, () => {
  console.log("Backend running on port 5000");
});
