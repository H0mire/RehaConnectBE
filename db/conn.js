const mongoose = require('mongoose');


const connectionString = process.env.URI || "mongodb://localhost:27017/";
// Verbinden mit der MongoDB-Datenbank
mongoose.connect(connectionString+rehadatatables, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
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
module.exports = mongoose;
