import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IUser } from '../models/userModel';

interface IOptionsType {
    email: string;
    subject: string;
    text: string;
}

const sendEmail = async (options: IOptionsType) => {
    // 1) Create a transporter
    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    //     // Activate in gmail "less secure app" option
    // })
    const transporter = nodemailer.createTransport(
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

    // 2) Define email options
    const mailOptions = {
        from: 'Sameer <hello@sameer.io>',
        to: options.email,
        subject: options.subject,
        text: options.text
    }
    // 3) Send the email
    await transporter.sendMail(mailOptions)
}

export class Email {
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
    public async send(template: string, subject: string) {
        // 1) Render HTML for email based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
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
            text: htmlToText.convert(html),
        }
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    public async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }
}

export default sendEmail;
