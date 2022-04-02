const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Book.js
const bookSchema = require('./Book');

const userSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         match: [/.+@.+\..+/, 'Must use a valid email address'],
      },
      password: {
         type: String,
         required: true,
      },

      savedBooks: [bookSchema],
   },

   {
      toJSON: {
         virtuals: true,
      },
   }
);

//hash the users password before saving it to the database
userSchema.pre('save', async function (next) {
   if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
   }

   next();
});

//check the password if the password is correct
userSchema.methods.isCorrectPassword = async function (password) {
   return bcrypt.compare(password, this.password);
};

//function for bookcount
userSchema.virtual('bookCount').get(function () {
   return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
