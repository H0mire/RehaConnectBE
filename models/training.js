import mongoose from 'mongoose'; // Importieren des mongoose-Moduls

// Definition des Training-Schemas
const trainingSchema = new mongoose.Schema({
	date: Date,
	durationInSeconds: Number,
	maxPulse: Number,
	minPulse: Number,
	avgPulse: Number,
	sumSteps: Number,
	avgSpeed: Number
});

// Erstellen des Training-Modells basierend auf dem Schema
const Training = mongoose.model('Training', trainingSchema);

// Exportieren des Training-Modells für die Verwendung in anderen Dateien
export default Training;
