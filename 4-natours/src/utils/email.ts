import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IUser } from '../models/userModel';

export default class Email {
    private to: string;
    private firstName: string;
    private url: string;
    private from: string;

    constructor(user: IUser, url: string) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from =`Sameer <${process.env.EMAIL_FROM!}>`
    }

    public newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Send grid
        }
        return nodemailer.createTransport(
            {
                host: process.env.MAILTRAP_HOST!,
                port: Number(process.env.MAILTRAP_PORT!),
                secure: false,
                family: 4,
                auth: {
                    user: process.env.MAILTRAP_USER!,
                    pass: process.env.MAILTRAP_PASS!,
                },
            } as SMTPTransport.Options
        );
    }

    // Send the actual email
    private async send(template: string, subject: string) {
        // 1) Render HTML for email based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName : this.firstName,
            url: this.url,
            subject: subject,
        })

        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        }
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    public async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    public async sendPasswordResetLink() {
        await this.send('resetPassword', 'Your password reset token (valid for only 10 minutes)')
    }
}
