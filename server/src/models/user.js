const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    "firstname" : {
        type : String,
        lowercase : true,
        required : [true, "First name is required"],
    },
    "lastname" : {
        type : String,
        lowercase : true,
        required : [true, "Last name is required"],
    },
    "institution" : {
        type : String,
        lowercase : true
    },
    "email" : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "an account associated with this email already exists"],
        lowercase : true,
        validate : [isEmail, "please enter a valid email address"]
    },
    "password" : {
        type : String,
        required : "Password is required",
        minlength : 8,
    },
    "attendingEvents" : [
        { type : Schema.Types.ObjectId, ref : "Event" }
    ],
    "hookEnabled" : {
        type : Boolean,
        default : true
    }
});



userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email : email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

userSchema.statics.pushEvent = async function(userId, eventId){
    try{
        const user = await this.findById(userId);
        user.attendingEvents.push(eventId);
        user.save();
    }catch(err){
        console.log(err);
    }
}

userSchema.pre("save", async function(next){
    if(this.hookEnabled){
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        this.hookEnabled = false;
    }
    next();
})

module.exports = model("User", userSchema);