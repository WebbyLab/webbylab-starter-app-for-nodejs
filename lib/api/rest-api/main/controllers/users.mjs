import chista from '../../chista.mjs';

import UsersCreate        from '../../../../use-cases/main/users/Create.mjs';
import UsersUpdate        from '../../../../use-cases/main/users/Update.mjs';
import UsersResetPassword from '../../../../use-cases/main/users/ResetPassword.mjs';
import UsersList          from '../../../../use-cases/main/users/List.mjs';
import UsersShow          from '../../../../use-cases/main/users/Show.mjs';
import UsersDelete        from '../../../../use-cases/main/users/Delete.mjs';

export default {
    create        : chista.makeUseCaseRunner(UsersCreate, req => req.body),
    update        : chista.makeUseCaseRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeUseCaseRunner(UsersResetPassword, req => req.body),
    list          : chista.makeUseCaseRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeUseCaseRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeUseCaseRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
