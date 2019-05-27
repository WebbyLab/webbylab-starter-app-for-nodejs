import chista from '../chista.js';

import ActionsSubmit from '../services/actions/Submit';

export default {
    submit : chista.makeServiceRunner(ActionsSubmit, req => ({ ...(req.body.data || {}), id: req.params.id }))
};
