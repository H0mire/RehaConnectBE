import express from "express";
import shortid from "shortid";
import bcrypt from "bcrypt";
import moment from "moment";
import User from '../models/user.js';
import Invitation from '../models/invitation.js';
const jwt = import('jsonwebtoken');
const SECRET = process.env.SECRET;



const router = express.Router();

router.get('/users', async (req, res) => {
	try {
		// Abrufen aller Benutzer aus der Datenbank
		const users = await User.find().limit(50);

		res.status(200).send(users);
	} catch (error) {
		res.status(500).json({ message: 'Interner Serverfehler' });
	}
});

router.post('/invite', async (req, res) => {
	try {
		// Extrahiere die Einladungsdetails aus dem Anfragekörper
		const { firstName, lastName, birthDate, role, idDoctor } = req.body;
		console.log(req.body);

		let birthDateT = moment(birthDate, 'DD.MM.YYYY').toDate();
		// Generiere den InvitationCode
		const invitationCode = shortid.generate();

		// Erstelle eine neue Einladung
		const invitation = new Invitation({
			invitationCode,
			firstName,
			lastName,
			birthDate:birthDateT,
			role,
			idDoctor
		});
		console.log(invitation.birthDate);
		// Speichere die Einladung in der Datenbank
		await invitation.save();

		res.status(201).json({ message: 'Einladung erstellt', invitationCode });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Ein Fehler ist aufgetreten' });
	}
});




// Registrierung
router.post('/register', async (req, res) => {
	try {
		const { username, email, password, birthDate, invitationCode } = req.body;

		// Überprüfe, ob der Benutzer bereits existiert
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: 'Benutzername bereits vergeben' });
		}

		const invitation = await Invitation.findOne(filter={
			invitationCode:invitationCode
		})
		if (invitation) {
			return res.status(400).json({ message: 'Einladung ungültig' });
		}
		firstName = invitation.firstName;
		lastName = invitation.lastName;
		role = invitation.role;
		// Neuen Benutzer erstellen
		const newUser = new User({ firstName, lastName, email, username, password, birthDate, role });
		await newUser.save();

		const token = jwt.sign({ userId: newUser._id }, SECRET, { expiresIn: '1h' });

		res.status(201).json({ message: 'Registrierung erfolgreich', token });
	} catch (error) {
		res.status(500).json({ message: 'Interner Serverfehler' });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		// Überprüfe, ob der Benutzer existiert
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
		}

		// Überprüfe das Passwort
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
		}

		// Erstelle ein JWT-Token
		const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });

		res.json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Interner Serverfehler' });
	}
});

export default router;