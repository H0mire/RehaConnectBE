import express from "express";
import db from "../db/conn.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/:id", async (req, res) => {
	let collection = await db.collection("trainings");
	let results = await collection.aggregate([
	  {"$IDUser": ObjectId(req.params.id)}
	]).toArray();
	res.send(results).status(200); 
  });
  

export default router;