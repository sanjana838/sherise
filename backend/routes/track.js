const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

router.post("/track", async (req, res) => {
    await Visitor.create({
        ipAddress: req.ip,
        pageVisited: req.body.page,
        userAgent: req.headers["user-agent"]
    });

    // REAL-TIME EMIT
    const io = req.app.get("io");
    io.emit("visitorUpdate");

    res.json({ message: "Tracked" });
});

module.exports = router;
