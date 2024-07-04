const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var UserSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    contact_no:  {
        type: Number
    },
    password: {
        required: true,
        type: String
    },
    type:{
      required: true,
      type: String,
      default: 'Customer'
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
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
  UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

module.exports = mongoose.model('users', UserSchema);;