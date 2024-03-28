const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON-encoded bodies and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (if any)
app.use(express.static('public'));

// POST route to handle sending emails
app.post('/api/send-email', (req, res) => {
    // Extract data from request body
    const { senderName, senderEmail, subject, message, recipientEmail } = req.body;

    // Construct 'from' address dynamically
    const from = `${senderName} <${senderEmail}>`;

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        auth: {
            user: '59560c94b2397a',
            pass: 'b15ed991eab552'
        }
    });

    // Define email options
    let mailOptions = {
        from: from,
        to: "markanthony.villudo@gmail.com",
        subject: "Portfolio",
        text: message
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).json({ error: 'Error occurred while sending email.' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully.' });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});