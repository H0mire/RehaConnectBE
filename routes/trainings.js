import express from "express";
import Training from "../models/training.js";
import HealthData from "../models/healthData.js";
import moment from "moment";
import { ObjectId } from "mongodb";

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

router.post('/', async (req, res) => {
	try {
		// Extrahiere die Einladungsdetails aus dem Anfragekörper
		const { date, durationInSeconds, maxPulse, minPulse, avgPulse, sumSteps, avgSpeed, pulseData, speedData } = req.body;
		console.log(req.body);

		let dateT = moment(date, 'DD.MM.YYYY').toDate();
		let idPatient = "";
		// Erstelle eine neue Einladung
		const training = new Training({
			date: dateT,
			durationInSeconds,
			maxPulse,
			minPulse,
			avgPulse,
			sumSteps,
			avgSpeed
		});

		const pulseHealthData = new HealthData({
			metric: "Pulse",
			data: pulseData,
			trainingId: new ObjectId(training.id)

		});

		const speedHealthData = new HealthData({
			metric: "Speed",
			data: speedData,
			trainingId: new ObjectId(training.id)
		});

		await speedHealthData.save();
		await pulseHealthData.save();

		// Speichere die Einladung in der Datenbank
		await training.save();

		res.status(201).json({ message: 'Training erstellt' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
	}
});

router.get("/", async (req, res) => {
	try {
		const training = await Training.find();
		res.status(200).json(training);
	} catch (error) {
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

router.get("/pulse/:id", async (req, res) => {
	try {
		const pulseData = await HealthData.findOne({ trainingId: req.params.id, metric: "Pulse" });
		console.log(pulseData)
		if (!pulseData) {
			return res.status(400).json("not found");
		}
		res.status(200).json(pulseData.data);
	} catch (error) {
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

router.get("/speed/:id", async (req, res) => {
	try {
		const speedData = await HealthData.findOne({ trainingId: req.params.id, metric: "Speed" });
		if (!speedData) {
			return res.status(400).json("not found");
		}
		res.status(200).json(speedData);
	} catch (error) {
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

export default router;