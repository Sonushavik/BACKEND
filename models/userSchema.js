import mongoose from "mongoose";
import validator from "validator";
const { contains, isEmail } = validator;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
        firstName : {
                type: String,
                required: true,
                minLength: [3, "Firsr Name Must contain At least 3 Character!"]
        },
        lastName : {
                type: String,
                required: true,
                minLength: [2, "Firsr Name Must contain At least 2 Character!"]
        },
        email:{
                type: String,
                required:true,
                validate: [validator.isEmail, "Please Provide a Valid Email"]
        },

        phone : {
                type: String,
                required:true,
                minLength:[11, "Phone Number Must contain Exact 11 Digits" ],
                maxLength:[11, "Phone Number Must contain Exact 11 Digits" ]       
         },
       dob: {
        type: Date,
        required: [true," DOB is required"],
       },
       gender: {
        type: String,
        required: true,
        enum : ["Male", "Female", "Other","male","female","other"],
       },
       password: {
        type: String,
        required: true,
        minLength: [8, "Password Must Contain At Least 8 Character!"],
        required: true,
        select: false
       },
       role:{
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor"],
       },
       doctorDeparment : {
        type: String,
       },
       docAvatar: {
        public_id : String,
        url: String,
       },
});

userSchema.pre("save", async function(next) {
        if(!this.isModified("password")){
                next()
        }
        this.password =await bcrypt.hash(this.password,8);
})

//method to compare hash passeword
userSchema.methods.comparePassword = async function (enterdPassword) {
        return await bcrypt.compare(enterdPassword, this.password);
};


//method to create json web Token
userSchema.methods.generateJsonWebToken = function () {
        return jwt.sign({id: this._id}, process.env.JWT_SECRET_TOKEN,{
                expiresIn: process.env.JWT_EXPIRES,
        });
};

export const User = mongoose.model("User", userSchema)