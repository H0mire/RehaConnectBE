// Importieren der erforderlichen Module
import express from "express"; // Importieren des Express-Frameworks
import shortid from "shortid"; // Importieren des shortid-Moduls zur Generierung von eindeutigen IDs
import bcrypt from "bcrypt"; // Importieren des bcrypt-Moduls zur Passwort-Hashing
import moment from "moment"; // Importieren des moment-Moduls zur Arbeit mit Datumsformaten
import User from '../models/user.js'; // Importieren des Benutzermodells aus einer externen Datei
import Invitation from '../models/invitation.js'; // Importieren des Einladungsmodells aus einer externen Datei
const jwt = import('jsonwebtoken'); // Importieren des jsonwebtoken-Moduls zur Token-Authentifizierung
const SECRET = process.env.SECRET; // Geheimes Schlüsselwort für die Token-Signierung aus Umgebungsvariablen abrufen
const DEV = process.env.DEV || false; // DEV-Modus aus Umgebungsvariablen abrufen oder auf "false" festlegen, wenn nicht definiert

// Erstellen eines Express-Routers
const router = express.Router();

// GET-Route für die Stammseite
router.get('/', async (req, res) => {
	try {
		// Abrufen aller Benutzer aus der Datenbank (Maximal 50 Benutzer)
		const users = await User.find().limit(50);

		// Erfolgreiche Antwort mit den Benutzern senden
		res.status(200).send(users);
	} catch (error) {
		// Fehlerbehandlung für interne Serverfehler
		res.status(500).json({ message: 'Interner Serverfehler' });
	}
});

// POST-Route für das Erstellen einer Einladung
router.post('/invite', async (req, res) => {
	try {
		// Extrahieren der Einladungsdetails aus dem Anfragekörper
		const { firstName, lastName, birthDate, role, idDoctor } = req.body;
		console.log(req.body);

		// Konvertieren des Datumsformats von DD.MM.YYYY zu einem Date-Objekt
		let birthDateT = moment(birthDate, 'DD.MM.YYYY').toDate();

		// Generieren des Einladungscodes mit Hilfe des shortid-Moduls
		const invitationCode = shortid.generate();
		
		// Erstellen einer neuen Einladung
		const invitation = new Invitation({
			invitationCode,
			firstName,
			lastName,
			birthDate: birthDateT,
			role,
			idDoctor
		});
		console.log(invitation.birthDate);

		// Speichern der Einladung in der Datenbank
		await invitation.save();

		// Erfolgreiche Antwort mit einer Erfolgsmeldung und dem Einladungscode senden
		res.status(201).json({ message: 'Einladung erstellt', invitationCode });
	} catch (error) {
		// Fehlerbehandlung für andere Fehler
		console.log(error);
		res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
	}
});

// Exportieren des Routers, um in anderen Dateien verwendet zu werden
export default router;
