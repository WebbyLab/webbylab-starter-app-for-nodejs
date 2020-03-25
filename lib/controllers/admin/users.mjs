import chista from '../../chista.mjs';

import UsersCreate        from '../../services/admin/users/Create.mjs';
import UsersUpdate        from '../../services/admin/users/Update.mjs';
import UsersResetPassword from '../../services/admin/users/ResetPassword.mjs';
import UsersList          from '../../services/admin/users/List.mjs';
import UsersShow          from '../../services/admin/users/Show.mjs';
import UsersDelete        from '../../services/admin/users/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(UsersCreate, req => req.body),
    update        : chista.makeServiceRunner(UsersUpdate, req => ({ ...req.body, id: req.params.id })),
    resetPassword : chista.makeServiceRunner(UsersResetPassword, req => ({ ...req.query, ...req.params })),
    list          : chista.makeServiceRunner(UsersList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(UsersShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(UsersDelete, req => ({ ...req.body, id: req.params.id }))
};
