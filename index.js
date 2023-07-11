// Importieren von Konfigurationsdateien
import "./configureEnv.js"; // Importieren einer Konfigurationsdatei für Umgebungsvariablen
import './db/conn.js'; // Importieren einer Konfigurationsdatei für die Datenbankverbindung

// Importieren von erforderlichen Modulen
import express from "express"; // Importieren des Express-Frameworks
import cors from "cors"; // Importieren des Cors-Moduls zur Behandlung von CORS-Richtlinien
import "express-async-errors"; // Importieren des express-async-errors-Moduls zur asynchronen Fehlerbehandlung

// Importieren der benutzerdefinierten Routen und Authentifizierung
import users from "./routes/users.js"; // Importieren des Benutzer-Routenmoduls
import trainings from "./routes/trainings.js"; // Importieren des Trainings-Routenmoduls
import auth from "./auth/authService.js"; // Importieren des Authentifizierungsmoduls

// Definieren des Portwerts für den Server
const PORT = process.env.PORT || 3000;

// Prüfen, ob der Server im Entwicklungsmodus ist
const DEV = process.env.DEV || false;

// Erstellen einer Express-Anwendung
const app = express();

// Verwenden des Cors-Moduls für CORS-Konfiguration
app.use(cors());

// Verwenden des express.json-Middleware zum Parsen von JSON-Anfragen
app.use(express.json());

// Verwenden des Authentifizierungsrouters für den "/auth/"-Pfad
app.use("/auth/", auth);

// Überprüfen, ob der Server nicht im Entwicklungsmodus ist
if (!DEV) {
  // Verwenden der Authentifizierungsmiddleware für den "/app"-Pfad, um den Zugriff zu sichern
  app.use("/app", auth.authenticateToken);
}

// Verwenden der Benutzer- und Trainingsrouten
app.use("/app/users", users);
app.use("/app/trainings", trainings);

// Globale Fehlerbehandlung
app.use((err, _req, res, next) => {
  // Senden einer 500-Fehlerantwort mit einer allgemeinen Fehlermeldung
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// Starten des Express-Servers und das Zuhören auf dem angegebenen Port
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
