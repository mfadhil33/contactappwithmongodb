const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/padil', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


// membuat schema
// const Contact = mongoose.model('Contact', {

//   nama: {
//     type: String,
//     required: true,
//   },
//   nohp: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,

//   },



// });

// // menambah 1 data
// const contact1 = new Contact({
//   nama: 'mhd fadhil',
//   nohp: '085263638667',
//   email: 'fadilgaming522@gmail.com',
// });


// simpan ke collection
// contact1.save().then((contact) => console.log(contact));

