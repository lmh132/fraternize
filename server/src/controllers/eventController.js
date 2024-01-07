const Event = require('../models/event');
const User = require('../models/user');

async function create(req, res){
    const { host, institution, title, description, capacity, location, datetime, institutiononly, private } = req.body;
    try{
        const event = new Event({ 'host' : host, 
                                            'institution' : institution,
                                            'title' : title, 
                                            'description' : description, 
                                            'capacity' : capacity, 
                                            'location' : location, 
                                            'datetime' : datetime, 
                                            'institutiononly' : institutiononly,
                                            'private' : private,
                                            'invitedList' : [],
                                            'attendingList' : [] });
        await event.save();
        res.status(201).json({ event : event._id });
    }catch(err){
        console.log(err);
        res.status(400).send("Error, event not created");
    }
    
}

async function view(req, res){
    let id = req.params.eventId;
    let temp = await Event.findById(id);
    let selected = await temp.populate({ path : 'host' });
    res.render('events/viewone', { selected : selected });
}

async function signUp(req, res){
    const { eventId } = req.body;
    const userId = res.locals.user._id;
    Event.pushAttendee(eventId, userId);
    User.pushEvent(userId, eventId);
    res.status(201).json({ event : eventId });
}

async function creatorView(req, res){
    let id = req.params.eventId;
    let temp = await Event.findById(id);
    let selected = await temp.populate(['host', 'attendingList', 'invitedList']);
    res.render('events/creatorview', { selected : selected });
}

module.exports = {
    create,
    view,
    signUp,
    creatorView
}