import mongoose from 'mongoose'; // Importieren des mongoose-Moduls

// Definition des Einladungs-Schemas
const invitationSchema = new mongoose.Schema({
  invitationCode: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  role: String,
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Hier wird angegeben, auf welches Modell sich das ObjectId-Feld bezieht
  }
});

// Erstellen des Einladungs-Modells basierend auf dem Schema
const Invitation = mongoose.model('Invitation', invitationSchema);

// Exportieren des Einladungs-Modells für die Verwendung in anderen Dateien
export default Invitation;
