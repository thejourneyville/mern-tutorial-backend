const mongoose = require("mongoose");
// module to encrypt password
const bcrypt = require("bcrypt");
// module to add email and password validation
const validator = require("validator");

// creating schema instance from mongoose
const Schema = mongoose.Schema;
// defining schema - email must be unique
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

//static 'signup' method
// this does extra work for the model, and is done
// asynchronously
userSchema.statics.signup = async function(email, password) {

    // validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    // were making sure that 'email' in the userSchema is unique,
    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email aleady in use");
    }
    // adding salt (added characters) to the password before hashing,
    const salt = await bcrypt.genSalt(10);
    // and hashing the password
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ email, password: hash });

    return user;
};

// export the model 'exportS'<-
module.exports = mongoose.model("User", userSchema);
