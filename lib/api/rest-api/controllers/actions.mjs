import chista        from '../../../chista.mjs';

import ActionsSubmit from '../../../use-cases/actions/Submit.mjs';

export default {
    submit : chista.makeServiceRunner(ActionsSubmit, req => ({ ...(req.body.data || {}), id: req.params.id }))
};
