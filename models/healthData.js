import mongoose from 'mongoose'; // Importieren des mongoose-Moduls

// Definition des Gesundheitsdaten-Schemas
const healthDataSchema = new mongoose.Schema({
  metric: String,
  data: Object,
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Training"
  }
});

// Erstellen des Gesundheitsdaten-Modells basierend auf dem Schema
const HealthData = mongoose.model('HealthData', healthDataSchema);

// Exportieren des Gesundheitsdaten-Modells für die Verwendung in anderen Dateien
export default HealthData;
