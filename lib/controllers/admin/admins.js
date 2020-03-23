import chista from '../../chista.js';

import AdminsCreate        from '../../services/admin/admins/Create.js';
import AdminsResetPassword from '../../services/admin/admins/ResetPassword.js';
import AdminsList          from '../../services/admin/admins/List.js';
import AdminsShow          from '../../services/admin/admins/Show.js';
import AdminsDelete        from '../../services/admin/admins/Delete.js';

export default {
    create        : chista.makeServiceRunner(AdminsCreate, req => req.body),
    resetPassword : chista.makeServiceRunner(AdminsResetPassword, req  => ({ ...req.body, id: req.params.id })),
    list          : chista.makeServiceRunner(AdminsList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(AdminsShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(AdminsDelete, req => ({ ...req.body, id: req.params.id }))
};
