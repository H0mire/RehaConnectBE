import express from 'express'; // Importieren des Express-Moduls
import jwt from 'jsonwebtoken'; // Importieren des jsonwebtoken-Moduls
import bcrypt from "bcrypt"; // Importieren des bcrypt-Moduls zur Passwort-Hashing
import User from '../models/user.js'; // Importieren des Benutzermodells aus einer externen Datei
import Invitation from '../models/invitation.js'; // Importieren des Einladungsmodells aus einer externen Datei

// Erstelle eine Express-App
const router = express.Router();

// Geheimer Schlüssel für die JWT-Signatur
const secretKey = process.env.SECRET;

// Middleware für die Überprüfung des JWT-Tokens
function authenticateToken(req, res, next) {
  // Hole den Token aus dem Authorization-Header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // Token fehlt
    return res.sendStatus(401);
  }

  // Überprüfe und verifiziere den Token
  jwt.verify(token, secretKey, (err, userId) => {
    if (err) {
      // Token ungültig
      return res.sendStatus(403);
    }

    // Füge den decodierten Benutzer zum Anfrageobjekt hinzu
    req.user = userId;

    // Rufe die nächste Middleware oder den nächsten Handler auf
    next();
  });
}

// Registrierung
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, invitationCode } = req.body;

    // Überprüfe, ob der Benutzer bereits existiert
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Benutzername bereits vergeben' });
    }

    // Überprüfe die Einladung
    const invitation = await Invitation.findOne({ invitationCode });
    if (!invitation) {
      return res.status(400).json({ message: 'Einladung ungültig' });
    }

    // Extrahiere die Einladungsdetails
    const { firstName, lastName, birthDate, role } = invitation;

    // Hashen des Passworts
    const hashedPassword = await bcrypt.hash(password, 10);

    // Neuen Benutzer erstellen
    const newUser = new User({ firstName, lastName, email, username, hashedPassword, birthDate, role });
    await newUser.save();

    // Erstellen und Signieren eines JWT-Tokens
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - decoded.iat;

    res.status(201).json({ message: 'Registrierung erfolgreich', token, expiresIn });
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
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    // Erstelle ein JWT-Token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp - decoded.iat;

    res.status(200).json({ message: 'Login erfolgreich', token, expiresIn });
  } catch (error) {
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Middleware authenticateToken der Router-Instanz hinzufügen
router.authenticateToken = authenticateToken;

// Exportieren des Routers für die Verwendung in anderen Dateien
export default router;
