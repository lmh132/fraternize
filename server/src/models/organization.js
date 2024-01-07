const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const orgSchema = new Schema({
    "name" : {
        type : String,
        required : "Name is required",
        unique : true,
        lowercase : true,
        minlength : 4,
        maxlength : 50
    },
    "affiliation" : {
        type : String,
        required : "Institutional affiliation is required",
        lowercase : true,
        minlength : 4,
        maxlength : 50
    },
    "email" : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "an organization associated with this email already exists"],
        lowercase : true,
        validate : [isEmail, "please enter a valid email address"]
    },
    "password" : {
        type : String,
        required : "Password is required",
        minlength : 8,
    },
    "events" : [
        { type : Schema.Types.ObjectId, ref : "Event" }
    ],
    "hookEnabled" : {
        type : Boolean,
        default : true
    }
});

orgSchema.statics.pushEvent = async function(orgId, eventId){
    try{
        const org = await this.findById(orgId);
        org.events.push(eventId);
        org.save();
    }catch(err){
        console.log(err);
    }
}

orgSchema.statics.login = async function(email, password){
    const org = await this.findOne({ email : email });
    if(org){
        const auth = await bcrypt.compare(password, org.password);
        if(auth){
            return org;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

//Re-hashing password every time, changes it
orgSchema.pre("save", async function(next){
    if(this.hookEnabled){
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        this.hookEnabled = false;
    }
    next();
})

module.exports = model("Organization", orgSchema);