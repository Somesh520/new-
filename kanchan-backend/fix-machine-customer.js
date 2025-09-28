const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const Machine = mongoose.connection.db.collection('machines');
    const Customer = mongoose.connection.db.collection('customers');
    
    // Get the first customer
    const firstCustomer = await Customer.findOne({});
    console.log('First customer:', firstCustomer._id, firstCustomer.name);
    
    // Update the machine to reference this customer
    const result = await Machine.updateOne(
      { _id: new mongoose.Types.ObjectId('68c02e449d59c5bdfabb00f8') },
      { $set: { customer: firstCustomer._id } }
    );
    
    console.log('Update result:', result);
    
    // Also update the customer to include this machine in their machines array
    const customerUpdate = await Customer.updateOne(
      { _id: firstCustomer._id },
      { $addToSet: { machines: new mongoose.Types.ObjectId('68c02e449d59c5bdfabb00f8') } }
    );
    
    console.log('Customer update result:', customerUpdate);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  });
