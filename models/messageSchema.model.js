import mongoose from "mongoose";
import validator from "validator";
const { contains, isEmail } = validator;


const messageSchema = new mongoose.Schema({
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
         message : {
                type: String,
                required:true,
                minLength:[11, "Phone Number Must contain Exact 11 Digits" ]
         },
})

export const Message = mongoose.model("Message", messageSchema)