const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');

router.post('/auth/login', (req, res)=>{
    let userData ;
    User.findOne({email: req.body.email}).then(async (user, err)=>{
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
            user.last_login = Date.now;
            const options = { new: false };
            let results = User.findByIdAndUpdate(
                user._id, user, options
            );
            userData = results._update;
            var expTime = (new Date().getTime()/1000) + 2700;
          
          const data = await User.findOne({_id: userData._id});
          console.log(userData)
          var result={
              id: data._id,
              email: data.email,
              userName: data.userName,
              type: data.type,
              token: jwt.sign({ email: data.email, userName: data.userName, _id: data._id, type: data.type, exp: expTime }, 'hotel-secret-key'),
          }
          return res.json(result);
    });
});

router.post('/auth/signUp', (req,res)=>{
    const userData = {
        "userName": req.body.userName, 
        "email": req.body.email,  
        "type": req.body.type, 
        "password": bcrypt.hashSync(req.body.password, 10)
    }
    var newUser = new User(userData);
    newUser.save().then(result => {
        return res.json({message: 'User added.'});
    },(err)=>{
        return res.status(400).send({message: err});
    });
});

router.get('/vendor/getProfile/', async (req,res)=>{
    try{
        const data = await User.findOne({_id: req.user._id});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.put('/vendor/updateProfile/:id', async(req,res)=>{
    const passData = {
        'userName':req.body.userName,
        'contact_no': req.body.contact_no,
        'address': req.body.address,
        'city': req.body.city,
        'state': req.body.state,
        'country': req.body.country
    }
    try{
        const id = req.params.id;
        const updatedData = passData;
        const options = { new: false };
        const result = await User.findByIdAndUpdate(
            id, updatedData, options
        )
        res.json(result)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/vendor/bookNow', (req,res)=>{
    const bookingData = {
        "guestFirstName": req.body.firstName, 
        "guestLastName": req.body.lastName, 
        "guestEmail": req.body.email,   
        "contact_no": req.body.mobileNumber, 
        "aadharcardNo": req.body.adharNumber,  
        "checkInDate": req.body.startDate,   
        "checkOutDate": req.body.endDate,   
        "totalGuest": req.body.guests,   
        "totalRooms": req.body.room,    
        "guestList": req.body.guestDetails,    
        "totalAmount": req.body.calculatedAmount,    
        "roomType": req.body.roomType
    }
    var newBooking = new Booking(bookingData);
    newBooking.save().then(result => {
        return res.json({message: 'Hotel Book Successfully!.'});
    },(err)=>{
        return res.status(400).send({message: err});
    });
});

module.exports = router;