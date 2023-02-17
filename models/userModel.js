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
userSchema.statics.signup = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
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

// static 'login' method
// this also does extra work for the model, and is done
// asynchronously
userSchema.statics.login = async function (email, password) {
    // validation
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    // checks to see if user email is in database
    const user = await this.findOne({ email });

    // throws error if not
    if (!user) {
        throw Error("Incorrect email");
    }

    // then checks user requst password with password on database
    const match = await bcrypt.compare(password, user.password);

    // if not matched
    if (!match) {
        throw Error("Incorrect password");
    }
    // otherwise all is good and return user
    return user;
};

// export the model 'exportS'<-
module.exports = mongoose.model("User", userSchema);
