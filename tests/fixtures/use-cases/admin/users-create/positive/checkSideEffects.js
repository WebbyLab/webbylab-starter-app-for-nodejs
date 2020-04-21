import nodemailerMock from 'nodemailer-mock';
import Action         from '../../../../../../lib/domain-model/StoredTriggerableAction.mjs';
import User           from '../../../../../../lib/domain-model/User.mjs';

export default async function checkSideEffects({ userId }) {
    const user = await User.findById(userId, { allowPending: 1 });

    if (user.status !== 'PENDING') {
        throw new Error('User status should be "PENDING"');
    }

    const actions = await Action.findAll({ where : {
        payload : { '"userId"': userId },
        type    : 'ACTIVATE_USER'
    } });

    if (!actions.length) {
        throw new Error('Action with type "ACTIVATE_USER" should be created');
    }

    const sentMail = nodemailerMock.mock.getSentMail();

    if (sentMail.length !== 1) {
        throw new Error(`Wrong count of mails was sent = "${sentMail.length}". Should be "1"`);
    }

    if (sentMail[0].subject !== 'Email confirmation') {
        throw new Error(`Wrong email was sent ("${sentMail[0].subject}"). Should be "Email confirmation"`);
    }
}
