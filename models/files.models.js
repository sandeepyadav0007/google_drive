const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filepath: {
    type: String,
    required: [ true ,'path is required']
  },
  name: {
    type: String,
    required: [true ,'name is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, {
  timestamps: true
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
