const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const expressValidator = require('express-validator');
const hbs = require('hbs');
const uploadRouter = require('./routes/upload')
// set the template engine views
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'hbs');

// app.use("/", require("./routes/contact"));
// set public folder for static files css, images
app.use(express.static(__dirname + '/public'));
// set body parser
app.use(bodyParser.urlencoded({ extended: false }));
// use express validator in the app
app.use(expressValidator());



app.get('/', (req, res)=> {
    res.render('index', {
        title: 'Niki Nazemis Portfolio'
    });
});

// send email to contact
app.post('/sendEmail', (req, res) => {
    req.check('emailFrom').notEmpty().withMessage('Email is empty').isEmail().withMessage( 'Please Give a valid Email');
    req.check('emailSubject').notEmpty().withMessage('Please write a subject!')
    req.check('emailBody').notEmpty().withMessage('please write a messsage!')
    const errors = req.validationErrors();
    if(errors) {
        console.log(errors)
        res.render('index', {
            errors: errors
        })
    } else {
        //here we will setup all config for email and then send email
        // setup email tranporter(it is postman)
        let transporter = nodemailer.createTransport({
            service: 'gmail', //like deutsche post
            auth: {
                 user: 'test.purpose.mai@gmail.com', //your email
                 pass: '@r1ful2018' //your password of email addres
            }
          });
          const mailOptions = {
            from: req.body.emailFrom, //sender address
            to: 'niki.nazemi@gmail.com', //receiver address, must be given, I didnot want to give my privat email!
            subject: req.body.emailSubject, // email subject
            html: "<h1 style='color: blue'>" + req.body.emailBody + "</h1>" //email body or messages
         };
          // send email now
          transporter.sendMail(mailOptions, (err, info)=> {
            if(err) {
              console.log(err); 
            } else {
              console.log(info);
              res.send('email send successfully......!');
            }
          });
    }
 });


app.listen(PORT, (req, res)=> {
    console.log('Start...Server is running successfully on port ' + PORT)
});