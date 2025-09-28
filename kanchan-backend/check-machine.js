const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const Machine = mongoose.connection.db.collection('machines');
    const Customer = mongoose.connection.db.collection('customers');
    
    console.log('=== MACHINE 68c02e449d59c5bdfabb00f8 ===');
    const machine = await Machine.findOne({ _id: new mongoose.Types.ObjectId('68c02e449d59c5bdfabb00f8') });
    console.log(JSON.stringify(machine, null, 2));
    
    console.log('\n=== CUSTOMER FOR THIS MACHINE ===');
    if (machine && machine.customer) {
      const customer = await Customer.findOne({ _id: machine.customer });
      console.log(JSON.stringify(customer, null, 2));
    } else {
      console.log('No customer reference found');
    }
    
    console.log('\n=== ALL CUSTOMERS ===');
    const customers = await Customer.find({}).toArray();
    console.log('Total customers:', customers.length);
    customers.forEach(c => console.log('Customer ID:', c._id, 'Name:', c.name));
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
