import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username:String,
  hashedPassword:String,
  birthDate: Date,
  role: String,
  idDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Hier wird angegeben, auf welches Modell sich das ObjectId-Feld bezieht
  }
});

const User = mongoose.model('users', userSchema);

export default User;