import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const {Schema, model} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next){
    const user = this;
    bcryptjs.genSalt(10, function(err, salt) {
        if(err) return next();
        bcryptjs.hash(user.password, salt, function(err, hash) {
            if(err) return next();
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = async function(clientPassword){
    return await bcryptjs.compare(clientPassword, this.password);
}

export const User = model('User', userSchema);