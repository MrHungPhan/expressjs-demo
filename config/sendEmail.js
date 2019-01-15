var express = require('express');
var nodeMailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

//config mail
var transporter = nodeMailer.createTransport({
	service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'hungphan5995@gmail.com',
        clientId: '10484625773-plpih6ilq710hbmn55b697opq4nlb7d9.apps.googleusercontent.com',
        clientSecret: '9XUWthx85s_XB3F1ahcCtj-w',
        refreshToken: '1/WWi3baQMSZgmKTI9k7yNi6ey6FivpUTELa4GQyGwyuU',
    	accessToken: 'ya29.GltuBjgYxWdu3iIRMsFaEPKEF7IjNNkKjeVNifmiDf9npWlUOUDZrXG_j1krQCF_v6g9Q_S_umvoaStq7Atg4PbF28PvqeM2AHWmTOP9lOXR3vyt1gAZMHYqEjDw'
    }
})

//engin mail
transporter.use('compile', hbs({
	viewEngine : 'handlebars',
	viewPath : 'views/users',
	extName: '.html'
}));

module.exports  = transporter;