import nodemailerMock from 'nodemailer-mock';
import Action         from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';

export default async function checkSideEffects({ adminId }) {
    const actions = await Action.findAll({ where : {
        payload : { '"adminId"': adminId },
        type    : 'RESET_ADMIN_PASSWORD'
    } });

    if (!actions.length) {
        throw new Error('Action with type "RESET_ADMIN_PASSWORD" should be created');
    }

    const sentMail = nodemailerMock.mock.getSentMail();

    if (sentMail.length !== 1) {
        throw new Error(`Wrong count of mails was sent = "${sentMail.length}". Should be "1"`);
    }

    if (sentMail[0].subject !== 'Reset password') {
        throw new Error(`Wrong email was sent ("${sentMail[0].subject}"). Should be "Reset password"`);
    }
}
