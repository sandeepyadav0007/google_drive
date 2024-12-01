const ImageKit = require('imagekit');
require('dotenv').config();


const imagekit = new ImageKit({
  publicKey: process.env.Public_key,
  privateKey: process.env.Private_key,
  urlEndpoint: process.env.Url_endpoint
});

module.exports = imagekit;
