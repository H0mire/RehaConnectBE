// Importieren der benötigten Module und Modelle
import express from "express";
import Training from "../models/training.js";
import HealthData from "../models/healthData.js";
import moment from "moment";
import { ObjectId } from "mongodb";

// Erstellen eines neuen Routers
const router = express.Router();

// GET-Route, um ein spezifisches Training anhand seiner ID zu erhalten
router.get("/:id", async (req, res) => {
	try {
		// Suche nach dem Training in der Datenbank
		const training = await Training.findOne({ _id: req.params.id });
		if (!training) {
			// Wenn das Training nicht gefunden wird, sende einen 404-Statuscode
			return res.status(404).json({ message: "Training nicht gefunden" });
		}
		// Wenn das Training gefunden wird, sende es als Antwort
		res.status(200).json(training);
	} catch (error) {
		// Bei einem Fehler sende einen 500-Statuscode
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

// POST-Route, um ein neues Training zu erstellen
router.post('/', async (req, res) => {
	try {
		// Extrahiere die Trainingsdetails aus dem Anfragekörper
		const { date, durationInSeconds, maxPulse, minPulse, avgPulse, sumSteps, avgSpeed, pulseData, speedData } = req.body;

		// Konvertiere das Datum in ein Date-Objekt
		let dateT = moment(date, 'DD.MM.YYYY').toDate();

		// Erstelle ein neues Training
		const training = new Training({
			date: dateT,
			durationInSeconds,
			maxPulse,
			minPulse,
			avgPulse,
			sumSteps,
			avgSpeed
		});

		// Erstelle neue HealthData-Objekte für Puls- und Geschwindigkeitsdaten
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

		// Speichere die HealthData-Objekte in der Datenbank
		await speedHealthData.save();
		await pulseHealthData.save();

		// Speichere das Training in der Datenbank
		await training.save();

		// Sende eine Bestätigungsnachricht als Antwort
		res.status(201).json({ message: 'Training erstellt' });
	} catch (error) {
		// Bei einem Fehler sende einen 500-Statuscode
		res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
	}
});

// GET-Route, um alle Trainings zu erhalten
router.get("/", async (req, res) => {
	try {
		// Suche nach allen Trainings in der Datenbank
		const training = await Training.find();
		// Sende die gefundenen Trainings als Antwort
		res.status(200).json(training);
	} catch (error) {
		// Bei einem Fehler sende einen 500-Statuscode
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

// GET-Route, um die Pulsdaten für ein spezifisches Training zu erhalten
router.get("/pulse/:id", async (req, res) => {
	try {
		// Suche nach den Pulsdaten in der Datenbank
		const pulseData = await HealthData.findOne({ trainingId: req.params.id, metric: "Pulse" });
		if (!pulseData) {
			// Wenn die Pulsdaten nicht gefunden werden, sende einen 400-Statuscode
			return res.status(400).json("not found");
		}
		// Wenn die Pulsdaten gefunden werden, sende sie als Antwort
		res.status(200).json(pulseData.data);
	} catch (error) {
		// Bei einem Fehler sende einen 500-Statuscode
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

// GET-Route, um die Geschwindigkeitsdaten für ein spezifisches Training zu erhalten
router.get("/speed/:id", async (req, res) => {
	try {
		// Suche nach den Geschwindigkeitsdaten in der Datenbank
		const speedData = await HealthData.findOne({ trainingId: req.params.id, metric: "Speed" });
		if (!speedData) {
			// Wenn die Geschwindigkeitsdaten nicht gefunden werden, sende einen 400-Statuscode
			return res.status(400).json("not found");
		}
		// Wenn die Geschwindigkeitsdaten gefunden werden, sende sie als Antwort
		res.status(200).json(speedData.data);
	} catch (error) {
		// Bei einem Fehler sende einen 500-Statuscode
		res.status(500).json({ message: "Interner Serverfehler" });
	}
});

// Exportiere den Router als Modul
export default router;
