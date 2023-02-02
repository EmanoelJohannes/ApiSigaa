const nodemailer = require('nodemailer');
const { resolve } = require('path');
const exphbs = require('express-handlebars');
const nodemailerhbs = require('nodemailer-express-handlebars');

const mailConfig = require("../config/mail");

class Mail {
    constructor(){
        const {host, port, secure, auth} = mailConfig;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null
        });

        this.transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        this.configureTemplates();
    }

    configureTemplates(){
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

        this.transporter.use('compile', nodemailerhbs({
            viewEngine: exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extName: '.hbs'
        }));
    }   

    sendMail(message){

        console.log("Mensagem enviada");

        return this.transporter.sendMail({
            ... mailConfig.default,
            ... message
        });
    }
}

module.exports = new Mail();