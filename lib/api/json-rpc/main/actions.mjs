import chista        from '../chista.mjs';
import ActionsSubmit from '../../../use-cases/main/actions/Submit.mjs';

export default {
    ActionsSubmit : chista.makeUseCaseRunner(ActionsSubmit)
};
