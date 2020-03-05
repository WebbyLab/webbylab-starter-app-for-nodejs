import chista from '../chista.js';

import UsersCreate        from '../services/users/Create.js';
import UsersUpdate        from '../services/users/Update.js';
import UsersResetPassword from '../services/users/ResetPassword.js';
import UsersList          from '../services/users/List.js';
import UsersShow          from '../services/users/Show.js';
import UsersDelete        from '../services/users/Delete.js';

export default {
    create        : chista.makeServiceRunner(UsersCreate, req => req.body),
    update        : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeServiceRunner(UsersResetPassword, req => req.body),
    list          : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
