/* eslint-disable no-unused-vars */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const { body, validationResult, check } = require('express-validator');


require('./utils/db');

const Contact = require('./model/contact');

const app = express();
const port = 3000;

// setup method over ride
app.use(methodOverride(''));

// setup method over ride
app.use(methodOverride('_method'));

// gunakan ejs
app.set('view engine', 'ejs');

// third-party middleware
app.use(expressLayouts);
/// app.use(morgan('dev'));

// built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({

  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

app.use(flash());

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'mhd fadhil',
      email: 'fadhilgaming522@gmail.com',

    },
    {
      nama: 'asd',
      email: 'asd@gmail.com',
    },
  ];
    // res.sendFile('./views/index.html', { root: __dirname });
  res.render('index', {
    layout: 'layouts/main-layout',
    nama: 'mhd fadhil',
    title: 'Halaman home',
    mahasiswa,
  });
});

app.get('/about', (req, res) => {
  // res.sendFile('./views/about.html', { root: __dirname });
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'about',
  });
});

// halaman contact
app.get('/contact', async (req, res) => {
  // res.sendFile('./views/contact.html', { root: __dirname });

  // Contact.find().then((contact) => {
  //   res.send(contact);
  // });

  const contacts = await Contact.find();

  // eslint-disable-next-line no-undef
  // const contacts = Contact.find();
  // console.log(contacts);
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Form Tambah Data Contact',
    layout: 'layouts/main-layout',

  });
});



// proses tambah data contact
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error('Nama Contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'email tidak valid').isEmail(),
    check('noHp', 'No Hp tidak valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    // eslint-disable-next-line no-shadow
    const { body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) // return res.status(400).json({ errors: errors.array() });
    // eslint-disable-next-line no-shadow, brace-style
    {
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        // kirimkan flash message
        req.flash('msg', 'Data Contact berhasil ditambahkan!');
        res.redirect('/contact');
      });
    }
  },
);

app.delete('/contact', (req, res) => {
  // eslint-disable-next-line no-shadow
  const { body } = req;
  Contact.deleteOne({ nama: body.nama }).then((result) => {
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
  });
});



// halaman detail contact
app.get('/contact/:nama', async (req, res) => {
  // const { params } = req;
  // const findData = findContact(params.nama);
  const findData = await Contact.findOne({ nama: req.params.nama });
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'detail',
    findData,
  });
});


// proses ubah data
app.put(
  '/contact',
  [
    body('nama').custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error('Nama Contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'email tidak valid').isEmail(),
    check('noHp', 'No Hp tidak valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    // eslint-disable-next-line no-shadow
    const { body } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) // return res.status(400).json({ errors: errors.array() });
    // eslint-disable-next-line no-shadow, brace-style
    {
      res.render('edit-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: body,
      });
    } else {
      Contact.updateOne(
        // eslint-disable-next-line no-undef, no-underscore-dangle
        { _id: body._id },
        {
          $set: {
            nama: body.nama,
            email: body.email,
            noHp: body.noHp,
          },
        },
      ).then((result) => {
        // kirimkan flash message
        req.flash('msg', 'Data contact berhasil diubah!');
        res.redirect('/contact');
      });
    }
  },
);


// form ubah data contact
app.get('/contact/ubah/:nama', async (req, res) => {
  const { params } = req;
  const contact = await Contact.findOne({ nama: params.nama });
  res.render('edit-contact', {

    title: 'Form ubah Data contact',
    layout: 'layouts/main-layout',
    contact,
  });
});



// delete contact
// app.get('/contact/delete/:nama', async (req, res) => {
//   const { params } = req;
//   const contact = await Contact.findOne({ nama: params.nama });

//   // jika contact tidak ada

//   if (!contact) {
//     res.status(400);
//     res.send('<h1>404</h1>');
//   } else {
//     // eslint-disable-next-line no-underscore-dangle
//     Contact.deleteOne({ _id: contact._id }).then((result) => {
//       req.flash('msg', 'Data Contact berhasil dihapus!');
//       res.redirect('/contact');
//     });
//   }
// });







app.listen(port, () => {
  console.info(`Mongo Contact App | listening at http://localhost:${port}`);
});
