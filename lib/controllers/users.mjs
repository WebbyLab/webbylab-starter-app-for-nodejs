import chista from '../chista.mjs';

import UsersCreate        from '../services/users/Create.mjs';
import UsersUpdate        from '../services/users/Update.mjs';
import UsersResetPassword from '../services/users/ResetPassword.mjs';
import UsersList          from '../services/users/List.mjs';
import UsersShow          from '../services/users/Show.mjs';
import UsersDelete        from '../services/users/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(UsersCreate, req => req.body),
    update        : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeServiceRunner(UsersResetPassword, req => req.body),
    list          : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
