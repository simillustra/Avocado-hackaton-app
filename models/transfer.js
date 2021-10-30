const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema(
   {
      type: {
         type: String,
         required: true
      },
      payeeName: {
         type: String,
         required: true
      },
      date: {
         type: Date,
         required: true
      },
      amount: {
         type: Number,
         required: true
      },
      status: {
         type: String,
         required: true
      },
      reference: {
         type: String,
         required: true,
         trim: true,
         minlength: 2,
         maxlength: 20
      },
      sourceAccountId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Account'
      },
      sender: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User'
      },
      recipient: {
         type: String,
         required: true
         // type: mongoose.Schema.Types.ObjectId,
         // ref: 'User'
      }
   },
   {
      collection: "Transfer",
      collation: { locale: "en_US", strength: 1 },
      timestamps: true,
      toJSON: {
         virtuals: true,
         transform: (obj, ret) => {
            //delete ret._id;        
         },
      },
   }
);

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
