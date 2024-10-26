import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required!"],
    minLength: [3, "First Name must contain at least 3 characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required!"],
    minLength: [3, "Last Name must contain at least 3 characters!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    validate: [validator.isEmail, "Provide a valid email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required!"],
    validate: {
      validator: function (v) {
        return /^[0-9]{11}$/.test(v);
      },
      message: "Phone number must contain exactly 11 digits!",
    },
  },
  dob: {
    type: Date,
    required: [true, "DOB is required!"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required!"],
    enum: ["Male", "Female"],
  },
  appointment_date: {
    type: Date,
    required: [true, "Appointment Date is required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name is required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor's First Name is required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor's Last Name is required!"],
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address is required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor ID is required!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient ID is required!"],
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ patientId: 1 });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
