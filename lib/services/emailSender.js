import nodemailer            from 'nodemailer';
import sendmailTransport     from 'nodemailer-sendmail-transport';
import smtpTransport         from 'nodemailer-smtp-transport';
import stubTransport         from 'nodemailer-stub-transport';
import { promisifyAll }      from 'bluebird';

import { getTemplate }       from '../utils/templates';
import { mail, mainUrl }     from './../../etc/config';

const TRANSPORTS_BY_TYPE = {
    SMTP     : smtpTransport(mail.transport_options),
    SENDMAIL : sendmailTransport()
};

class EmailSender {
    constructor() {
        const isTestMode = process.env.MODE === 'test';

        const transport = isTestMode
            ? stubTransport()
            : TRANSPORTS_BY_TYPE[mail.transport];

        if (!transport) throw new Error('Transport not found');

        const options  = isTestMode
            ? { directory: '/tmp' }
            : mail.transport_options;

        this.transport = promisifyAll(nodemailer.createTransport(transport, options));
    }

    async send(type, destinationUser, data) {
        const sendData = { ...data, mainUrl };
        const template = await getTemplate(type);
        const mailOptions = {
            from    : mail.from,
            to      : destinationUser,
            subject : template.subject(sendData),
            html    : template.body(sendData)
        };

        try {
            const response = await this.transport.sendMailAsync(mailOptions);

            return response.message;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default new EmailSender();
