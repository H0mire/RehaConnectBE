import mongoose from 'mongoose';


const healthDataSchema = new mongoose.Schema({
  metric: String,
  data:Object,
  trainingId:{
	type:mongoose.Schema.Types.ObjectId,
	ref:"Training"
  }
});

const HealthData = mongoose.model('HealthData', healthDataSchema);

export default HealthData;
