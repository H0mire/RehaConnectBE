import express from "express";
import Training from "../models/training.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const training = await Training.findOne({ _id: req.params.id });
    if (!training) {
      return res.status(404).json({ message: "Training nicht gefunden" });
    }
    res.status(200).json(training);
  } catch (error) {
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

export default router;