import express from "express";
import { 
    patientRegister,
    login,
    addNewAdmin,
    getAllDoctors,
    getUserDetails,
    logoutAdmin,
    logoutPatient,
    addNewDoctor
} from "../controller/userController.js";
import { isAdminAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Routes
router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);  // Fixed route

router.get("/doctors", getAllDoctors);  // Added missing semicolon

// Admin routes
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Patient routes
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);

// Doctor routes
router.post('/doctor/addNew', isAdminAuthenticated, upload.single('docAvatar'), addNewDoctor);

export default router;
