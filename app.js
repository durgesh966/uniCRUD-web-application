const express = require('express');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const colors = require('colors');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash'); const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;
const connectDB = require('./config/DB/connection/connection');
connectDB();
const logIn = require('./config/DB/models/login');
const User = require('./config/DB/models/User');

const frontend = path.join(__dirname, 'public');
app.use(express.static(frontend));

const helpers = require('./helpers/helpers');

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    })
);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// --------------------------------Sign up route---------------------------
// --------------------------------Sign up route---------------------------
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, phone, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new logIn({
            username,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/login?message=Signup%20successful!%20You%20can%20now%20login.');
    } catch (error) {
        console.error(error);
        res.redirect('/signup?message=Signup%20faild!%20plese%20enter%20valid%20password.');
    }
});

// Login route
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await logIn.findOne({ email });

        if (!user) {
            // return res.redirect('/');
            const errorCode = 500;
            const errorMessage = 'User not registered. Please sign up or log in.';
            res.status(errorCode).render('error', { errorCode, errorMessage });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            req.session.user = user;
            res.redirect('/dashboard?message=Login%20successful!');
        } else {
            // res.redirect('/');
            const errorCode = 401;
            const errorMessage = "Something went wrong.";
            res.status(errorCode).render('error', { errorCode, errorMessage });

        }
    } catch (error) {
        console.error(error);
    }
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user });
    } else {
        res.redirect('/');
    }
});
// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/?message=Logout%20successful!');
    });
});

// -------------------------- end-----------------------------
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
// ----------------   user rasistered --------------------------------
app.get('/addUser', (req, res) => {
    try {
        res.render('addUser');
    } catch (error) {
        console.log(error);
    }
});
// see all Users data in one page 
app.get('/external-page', async (req, res) => {
    try {
        const users = await User.find().lean();
        res.render('externalPage', { users });
    } catch (error) {
        res.render('error', { error: error.message });
    }
});
app.get('/search', (req, res) => {
    res.render('search');
});
// search result
app.get('/search-results', async (req, res) => {
    try {
        const query = req.query.query || '';
        const users = await User.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } }, // Use RegExp to construct the regex pattern
                { phone: { $regex: new RegExp(query, 'i') } },
            ],
        }).lean();
        res.render('searchResults', { users, query }); // Assuming your template engine is set up properly
    } catch (error) {
        res.render('error', { error: error.message });
    }
});
// ... updating the User database
app.get('/update/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        res.render('updateForm', { user });
    } catch (error) {
        res.render('error', { error: error.message });
    }
});
// ----- end -----
app.post('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, email, gender, age, phone, address } = req.body;
        const updateData = {
            name,
            email,
            gender,
            age,
            phone,
            address,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/external-page');
    } catch (error) {
        res.render('error', { error: error.message });
    }
});
// ---- end 
// ---- delete user all data --------------------
app.post('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/external-page');
    } catch (error) {
        res.render('error', { error: error.message });
    }
});


// ------------------------- end of addUser ----------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server listening on port ${port}`.bgGreen.black);
});
