import express from "express";
import Booking from "../models/Booking.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

router.post("/", protect, async (req, res) => {
  try {
    const { serviceName, problem, price } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      serviceName,
      problem,
      price,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch {
    res.status(500).json([]);
  }
});

router.get("/all", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const bookings = await Booking.find().populate("user", "name email");
    res.json(bookings);
  } catch {
    res.status(500).json([]);
  }
});

router.put("/:id", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(booking);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;