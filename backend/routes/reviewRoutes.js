import express from "express";
import Review from "../models/Review.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { service, rating, text } = req.body;

    if (!service || !rating || !text) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = await Review.create({
      service,
      rating,
      text,
      user: req.user.id,
      userName: req.user.name,
      date: new Date().toDateString(),
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("REVIEW ERROR:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

export default router;