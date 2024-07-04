const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var BookingSchema = new mongoose.Schema({
    guestFirstName: {
        required: true,
        type: String
    },
    guestLastName: {
        required: true,
        type: String
    },
    guestEmail:  {
        type: String,
        required: true,
    },
    contact_no: {
        required: true,
        type: String
    },
    aadharcardNo:{
      required: true,
      type: String,
    },
    checkInDate: {
        required: true,
        type: Date
    },
    checkOutDate: {
        required: true,
        type: String
    },
    totalGuest: {
        required: true,
        type: String,
        default:0
    },
    totalRooms: {
        required: true,
        type: String,
        default:0
    },
    guestList: {
        type: Array
    },
    totalAmount: {
        required: true,
        type: String,
        default:0
    },
    roomType: {
        required: true,
        type: String
    },
    created: {
      type: Date,
      default: Date.now
    },
    last_login: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model('booking', BookingSchema);;