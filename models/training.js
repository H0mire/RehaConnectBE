const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
	date: Date,
	durationInSeconds: Number,
	maxPulse: Number,
	minPulse: Number,
	averagePulse: Number,
	sumSteps: Number,
	avgSpeed: Number,
	spo2: Number,
	idPatient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' // Hier wird angegeben, auf welches Modell sich das ObjectId-Feld bezieht
	}
});

const Training = mongoose.model('User', trainingSchema);

module.exports = Training;