import chista        from '../chista.mjs';

import ActionsSubmit from '../services/actions/Submit.mjs';

export default {
    submit : chista.makeServiceRunner(ActionsSubmit, req => ({ ...(req.body.data || {}), id: req.params.id }))
};
