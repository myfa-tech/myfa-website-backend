import mongoose from 'mongoose';

const DashboardUser = mongoose.Schema({
	// default id
  firstname: String,
  lastname: String,
	email: String,
	password: String,
	isEmployee: Boolean,
});

export default DashboardUser;
