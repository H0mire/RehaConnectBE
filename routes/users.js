import express from "express";
import shortid from "shortid";
import bcrypt from "bcrypt";
import moment from "moment";
import User from '../models/user.js';
import Invitation from '../models/invitation.js';
const jwt = import('jsonwebtoken');
const SECRET = process.env.SECRET;

const router = express.Router();

router.get('/', async (req, res) => {
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

export default router;