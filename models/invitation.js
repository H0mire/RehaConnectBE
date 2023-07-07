import mongoose from 'mongoose';


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

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
