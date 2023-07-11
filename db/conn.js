import mongoose from 'mongoose'; // Importieren des mongoose-Moduls

const connectionString = process.env.URI || "mongodb://0.0.0.0:27017/";
// Verbinden mit der MongoDB-Datenbank
mongoose.connect(connectionString + "RehaConnect", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Verbunden mit der MongoDB-Datenbank');
}).catch((error) => {
  console.error('Fehler beim Verbinden mit der MongoDB-Datenbank:', error);
});

// Event-Handler für erfolgreiche Verbindung
mongoose.connection.on('connected', () => {
  console.log('Verbindung mit der MongoDB-Datenbank hergestellt');
});

// Event-Handler für Verbindungsfehler
mongoose.connection.on('error', (error) => {
  console.error('Fehler bei der Verbindung mit der MongoDB-Datenbank:', error);
});

// Event-Handler für getrennte Verbindung
mongoose.connection.on('disconnected', () => {
  console.log('Verbindung zur MongoDB-Datenbank getrennt');
});

// Exportiere die Mongoose-Instanz für den Zugriff in anderen Dateien
export default mongoose;
