const { Schema, model } = require('mongoose');
const Organization = require('../models/organization');

const eventSchema = new Schema({
    "host" : {
        type : Schema.Types.ObjectId, ref : "Organization"
    },
    "institution" : {
        type : String,
        lowercase : true
    },
    "title" : {
        type : String,
        required : "Event title is required",
        maxlength : 100
    },
    "description" : {
        type : String,
        required : "Event description is required",
        minlength : 4,
        maxlength : 2000
    },
    "capacity" : {
        type : Number,
    }, 
    "location" : {
        type : String,
        required : "Event location is required"
    },
    "datetime" : {
        type : String,
        required : "Event date/time is required"
    },
    "institutiononly" : {
        type : Boolean,
        required : "Event permissions are required"
    },
    "private" : {
        type : Boolean,
        required : "Event permissions are required"
    },
    "invitedList" : [
        { type : Schema.Types.ObjectId, ref : "User" }
    ],
    "attendingList" : [
        { type : Schema.Types.ObjectId, ref : "User" }
    ],
    "hookEnabled" : {
        type : Boolean,
        default : true
    }
});

eventSchema.statics.pushAttendee = async function(eventId, userId){
    try{
        let event = await this.findById(eventId);
        event.attendingList.push(userId);
        event.hookEnabled = false;
        event.save();
    }catch(err){
        console.log(err);
    }
}

eventSchema.statics.isValid = async function(eventId, userId){
    try{
        let event = await this.findById(eventId);
        return event.invitedList.includes(userId);
    }catch(err){
        console.log(err);
    }
}

//post, hookenabled not effective
eventSchema.post("save", async function(doc, next){
    if(this.hookEnabled){
        let org = doc.host;
        doc.institution = org.affiliation;
        Organization.pushEvent(org, this._id);
        console.log("event pushed");
        this.save()
    }
    next();
});

module.exports = model("Event", eventSchema);