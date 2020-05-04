import chista        from '../../chista.mjs';
import ActionsSubmit from '../../../../use-cases/main/actions/Submit.mjs';

export default {
    submit : chista.makeUseCaseRunner(ActionsSubmit, req => ({ data: req.body.data || {}, id: req.params.id }))
};
