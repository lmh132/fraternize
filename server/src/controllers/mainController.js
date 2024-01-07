const User = require('../models/user');
const Organization = require('../models/organization');
const Event = require('../models/event');

async function userView(req, res){
    const user = res.locals.user;
    const institutionalEvents = await Event.find({ institution : user.institution, private : false }).limit(5);
    const myEvents = await user.populate({ path : 'attendingEvents' });
    res.render('home', { myEvents: myEvents.attendingEvents,
                            institution : user.institution,
                            institutionalEvents : institutionalEvents });
}

async function orgView(req, res){
    const org = res.locals.org;
    const institutionalEvents = await Event.find({ institution : org.affiliation });
    const myEvents = await org.populate({ path : 'events' });
    console.log("events:");
    console.log(myEvents);
    console.log("---------");
    res.render('home', { myEvents: myEvents.events,
                            affiliation : org.affiliation,
                            institutionalEvents : institutionalEvents });
}

module.exports = {
    userView,
    orgView
}