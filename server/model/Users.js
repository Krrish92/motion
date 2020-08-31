const mongoose = require('mongoose');
const collectionName = 'Users';
const Schema = mongoose.Schema;
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  doc1: {
    type: String,
    required: false,
    default : ''
  },
  doc2: {
    type: String,
    required: false,
    default : ''
  }

},{ timestamps: true });
const model = mongoose.model('Users', schema, collectionName);
module.exports = model;
