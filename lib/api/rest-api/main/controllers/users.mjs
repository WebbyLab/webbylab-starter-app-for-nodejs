import chista from '../../../../chista.mjs';

import UsersCreate        from '../../../../use-cases/users/Create.mjs';
import UsersUpdate        from '../../../../use-cases/users/Update.mjs';
import UsersResetPassword from '../../../../use-cases/users/ResetPassword.mjs';
import UsersList          from '../../../../use-cases/users/List.mjs';
import UsersShow          from '../../../../use-cases/users/Show.mjs';
import UsersDelete        from '../../../../use-cases/users/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(UsersCreate, req => req.body),
    update        : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeServiceRunner(UsersResetPassword, req => req.body),
    list          : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
