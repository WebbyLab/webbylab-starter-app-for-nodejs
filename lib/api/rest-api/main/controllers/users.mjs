import chista from '../../../../chista.mjs';

import UsersCreate        from '../../../../use-cases/main/users/Create.mjs';
import UsersUpdate        from '../../../../use-cases/main/users/Update.mjs';
import UsersResetPassword from '../../../../use-cases/main/users/ResetPassword.mjs';
import UsersList          from '../../../../use-cases/main/users/List.mjs';
import UsersShow          from '../../../../use-cases/main/users/Show.mjs';
import UsersDelete        from '../../../../use-cases/main/users/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(UsersCreate, req => req.body),
    update        : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeServiceRunner(UsersResetPassword, req => req.body),
    list          : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
