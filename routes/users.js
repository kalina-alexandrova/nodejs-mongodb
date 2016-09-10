var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'),
    User = require('./../models/userModel.js');

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

router.route('/')
    //GET all users
    .get(function(req, res) {
        //console.log("here");
        return User.find(function(err, users) {
            if (err) {
                return console.error(err);
            } else {
                //console.log("res", req, users);
                //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                res.format({
                    html: function() {
                        res.render('users/index', {
                            title: 'All my users',
                            "users": users
                        });
                    },
                    json: function() {
                        res.json(users);
                    }
                });
            }
        });
    });


router.get('/new', function(req, res) {
    res.render('users/new', {
        title: 'Add New User'
    });
});

router.route('/')
    .post(function(req, res) {

        var user = new User();
        user.forename = req.body.forename;
        user.email = req.body.email;
        user.surname = req.body.surname;
        user.badge = req.body.badge;
        user.dob = req.body.dob;
        user.isstudent = req.body.isstudent;

        user.save(function(err) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                console.log('POST creating new user: ' + user);
                res.format({
                    html: function() {
                        res.location("users");
                        res.redirect("/users");
                    },
                    json: function() {
                        res.json(user);
                    }
                });
            }
        });

    });

router.route('/:id')

.get(function(req, res) {
    //console.log("req", req.params.id);
    return User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            console.log('GET Retrieving ID: ' + user._id);
            var userdob = user.dob.toISOString();
            userdob = userdob.substring(0, userdob.indexOf('T'))
            res.format({
                html: function() {
                    res.render('users/show', {
                        "userdob": userdob,
                        "user": user
                    });
                },
                json: function() {
                    res.json(user);
                }
            });
        }
    });
});

router.route('/:id/edit')

.get(function(req, res) {
    //console.log("req", req.params.id);
    return User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            //Return the user
            console.log('GET Retrieving ID: ' + user._id);
            var userdob = user.dob.toISOString();
            userdob = userdob.substring(0, userdob.indexOf('T'))
            res.format({
                //HTML response will render the 'edit.jade' template
                html: function() {
                    res.render('users/edit', {
                        title: 'User' + user._id,
                        "userdob": userdob,
                        "user": user
                    });
                },
                //JSON response will return the JSON output
                json: function() {
                    res.json(user);
                }
            });
        }
    });
})

.put(function(req, res) {

    // use our user model to find the user we want
    return User.findById(req.params.id, function(err, user) {

        if (err)
            res.send(err);

        user.forename = req.body.forename;
        user.email = req.body.email;
        user.surname = req.body.surname;
        user.badge = req.body.badge;
        user.dob = req.body.dob;
        user.isstudent = req.body.isstudent; // update the users info

        // save the user
        user.save(function(err) {
            if (err)
                res.send(err);

            res.format({
                html: function() {
                    res.redirect("/users/" + user._id);
                },
                //JSON responds showing the updated values
                json: function() {
                    res.json(user);
                }
            });
        });

    });
})

.delete(function(req, res) {
    User.remove({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            return console.error(err);
        } else {
            //Returning success messages saying it was deleted
            console.log('DELETE removing ID: ' + user._id);
            res.format({
                //HTML returns us back to the main page, or you can create a success page
                html: function() {
                    res.redirect("/users");
                },
                //JSON returns the item with the message that is has been deleted
                json: function() {
                    res.json({
                        message: 'deleted',
                        item: user
                    });
                }
            });
        }
    });
});

module.exports = router;