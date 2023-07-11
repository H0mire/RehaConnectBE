import mongoose from 'mongoose'; // Importieren des mongoose-Moduls

// Definition des Benutzer-Schemas
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  hashedPassword: String,
  birthDate: Date,
  role: String,
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Hier wird angegeben, auf welches Modell sich das ObjectId-Feld bezieht
  }
});

// Erstellen des Benutzer-Modells basierend auf dem Schema
const User = mongoose.model('users', userSchema);

// Exportieren des Benutzer-Modells für die Verwendung in anderen Dateien
export default User;
