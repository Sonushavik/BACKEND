import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, dob, gender, password, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User Already Registered", 400));
    }

    const allowedRoles = ["Patient"];
    if (role && !allowedRoles.includes(role)) {
        return next(new ErrorHandler("Invalid role specified!", 400));
    }

    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        role
    });

    generateToken(user, "User Registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password & Confirm Password Do Not Match!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    if (role !== user.role) {
        return next(new ErrorHandler("User Not Found With This Role!", 400));
    }

    generateToken(user, "User Login Successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, dob, gender, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with This Email Already Exists!`, 400));
    }

    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        role: "Admin"
    });

    res.status(200).json({
        success: true,
        message: "New Admin Registered",
        admin
    });
});

export const getAllDoctors = catchAsyncErrors(async(req, res, next) => {
        const doctors = await User.find({role: "Doctor"});
        res.status(200).json({
                success: true,
                doctors
        })
})

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
        const user = req.user;
        res.status(200).json({
                success: true,
                user,
        });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("adminToken","",{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User Log Out Successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("patientToken","",{
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User Log Out Successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        doctorDepartment
    } = req.body;

    const docAvatar = req.file;  // Multer stores the file in req.file

    // Validate input
    if (!firstName || !lastName || !email || !phone || !dob || !gender || !password || !doctorDepartment || !docAvatar) {
        return next(new ErrorHandler('Please Fill Full Form!', 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler('Doctor with this email already exists!', 400));
    }

    // Upload avatar to Cloudinary or save it locally
    let avatarUrl = '';
    if (docAvatar) {
        // Use Cloudinary or save the file directly to your server
        const result = await cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              return next(new ErrorHandler('Failed to upload avatar.', 500));
            }
            avatarUrl = result.secure_url; // Cloudinary returns the file's URL
          }
        );
    }

    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        doctorDepartment,
        docAvatar: avatarUrl, // Store the avatar URL in the database
        role: 'Doctor'
    });

    res.status(200).json({
        success: true,
        message: 'Doctor added successfully!',
        doctor
    });
});