import chista from '../../../../chista.mjs';

import AdminsCreate        from '../../../../services/admin/admins/Create.mjs';
import AdminsResetPassword from '../../../../services/admin/admins/ResetPassword.mjs';
import AdminsList          from '../../../../services/admin/admins/List.mjs';
import AdminsShow          from '../../../../services/admin/admins/Show.mjs';
import AdminsDelete        from '../../../../services/admin/admins/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(AdminsCreate, req => req.body),
    resetPassword : chista.makeServiceRunner(AdminsResetPassword, req  => ({ ...req.body, id: req.params.id })),
    list          : chista.makeServiceRunner(AdminsList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(AdminsShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(AdminsDelete, req => ({ ...req.body, id: req.params.id }))
};
