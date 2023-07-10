import express from "express";
import Training from "../models/training.js";
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
		const { date, durationInSeconds, maxPulse, minPulse, averagePulse, sumSteps, avgSpeed, spo2, idPatient } = req.body;
		console.log(req.body);

		let dateT = moment(date, 'DD.MM.YYYY').toDate();
		
		// Erstelle eine neue Einladung
		const training = new Training({
			date:dateT,
			durationInSeconds,
			maxPulse,
			minPulse,
			averagePulse,
			sumSteps,
			avgSpeed,
			spo2,
			idPatient: new ObjectId(idPatient)
		});
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
		let pulseData = [
			{ time: 0, pulse: 80 },
			{ time: 1, pulse: 88 },
			{ time: 2, pulse: 96 },
			{ time: 3, pulse: 104 },
			{ time: 4, pulse: 112 },
			{ time: 5, pulse: 120 },
		];

		let currentPulse = 120; // Ausgangspunkt für Variation
		for (let time = 6; time <= 60; time++) {
			// Füge Variation hinzu, indem ein zufälliger Wert zwischen -5 und 5 zum aktuellen Puls hinzugefügt wird
			let variation = Math.floor(Math.random() * 21) - 10;
			currentPulse += variation;
			pulseData.push({ time: time, pulse: currentPulse });
		}
		res.status(200).json(pulseData);
	} catch (error) {
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

router.get("/speed/:id", async (req, res) => {
	try {
		let speedData = [
			{ time: 0, speed: 7 },
			{ time: 1, speed: 8 },
			{ time: 2, speed: 9 },
			{ time: 3, speed: 9 },
			{ time: 4, speed: 9 },
			{ time: 5, speed: 9 },
		];

		let currentSpeed = 9; // Ausgangspunkt für Variation
		for (let time = 6; time <= 60; time++) {
			// Füge Variation hinzu, indem ein zufälliger Wert zwischen -1 und 1 zum aktuellen Speed hinzugefügt wird
			let variation = (Math.random() * 2) - 1;
			currentSpeed += variation;
			speedData.push({ time: time, speed: currentSpeed });
		}

		res.status(200).json(speedData);
	} catch (error) {
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

export default router;