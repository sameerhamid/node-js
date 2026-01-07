import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

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

export default sendEmail;
