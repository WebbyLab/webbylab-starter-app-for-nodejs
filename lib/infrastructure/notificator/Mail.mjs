import nodemailer        from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import smtpTransport     from 'nodemailer-smtp-transport';
import stubTransport     from 'nodemailer-stub-transport';
import { promisifyAll }  from '../../../packages.mjs';

import { getTemplate }   from './utils/templates.mjs';

const TRANSPORTS_BY_TYPE = {
    SMTP     : smtpTransport,
    SENDMAIL : sendmailTransport
};

class EmailSender {
    constructor({ mailOptions, mainUrl }) {
        const isTestMode = process.env.MODE === 'test';

        const options  = isTestMode
            ? { directory: '/tmp' }
            : mailOptions.transport_options;

        const transport = isTestMode
            ? stubTransport()
            : TRANSPORTS_BY_TYPE[mailOptions.transport](options);

        if (!transport) throw new Error('Transport not found');

        this.transport = promisifyAll(nodemailer.createTransport(transport, options));
        this.mainUrl = mainUrl;
        this.mailOptions = mailOptions;
    }

    async notify(type, destinationEmail, data) {
        const sendData = { ...data, mainUrl: this.mainUrl };
        const template = await getTemplate(type);

        return this.#sendEmail({
            from    : this.mailOptions.from,
            to      : destinationEmail,
            subject : template.subject(sendData),
            html    : template.body(sendData)
        });
    }

    #sendEmail = async (data) => {
        try {
            const response = await this.transport.sendMailAsync(data);

            return response.message;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export default EmailSender;
