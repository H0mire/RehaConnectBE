import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
	date: Date,
	durationInSeconds: Number,
	maxPulse: Number,
	minPulse: Number,
	avgPulse: Number,
	sumSteps: Number,
	avgSpeed: Number
});

const Training = mongoose.model('Training', trainingSchema);

export default Training;