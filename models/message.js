const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true
      },
      sentDate: {
         type: Date,
         required: true
      },
      recipient: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User'
      },
      content: {
         type: String,
         trim: true,
         required: true,
         minlength: 10
      },
      isRead: {
         type: Boolean,
         default: false
      }
   },
   {
      collection: "Message",
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
