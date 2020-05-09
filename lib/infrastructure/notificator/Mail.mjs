import nodemailer        from 'nodemailer';
import sendmailTransport from 'nodemailer-sendmail-transport';
import smtpTransport     from 'nodemailer-smtp-transport';

import { getTemplate }   from './utils/templates.mjs';

const TRANSPORTS_BY_TYPE = {
    SMTP     : smtpTransport,
    SENDMAIL : sendmailTransport
};

class EmailSender {
    constructor({ mailOptions, mainUrl } = {}) {
        const { transport: transportType, transportOptions } = mailOptions || {};

        const transport = TRANSPORTS_BY_TYPE[transportType](transportOptions);

        if (!transport) throw new Error('Transport not found');

        this.transport = nodemailer.createTransport(transport, transportOptions);
        this.mainUrl = mainUrl;
        this.mailOptions = mailOptions;
    }

    // for testing
    setTransport(transport) {
        this.transport = transport;
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
        const response = await this.transport.sendMail(data);

        return response.messageId;
    }
}

export default EmailSender;
