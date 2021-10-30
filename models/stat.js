const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema(
   {
      accountId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Account',
         required: true
      },
      date: {
         type: Date,
         required: true
      },
      income: {
         type: Number,
         required: true
      },
      expenses: {
         type: Number,
         required: true
      }
   },
   {
      collection: "Statistic",
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

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
