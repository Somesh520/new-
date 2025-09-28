const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const Machine = require('./models/machine.model');
    const Customer = require('./models/customer.model');
    
    console.log('=== TESTING MACHINE SEARCH WITH POPULATE ===');
    const machines = await Machine.find({ serial: new RegExp('MCHN', 'i') })
        .populate('customer', 'name')
        .select('model serial customer warrantyStatus warrantyExpiry');
    
    console.log('Results:');
    console.log(JSON.stringify(machines, null, 2));
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
