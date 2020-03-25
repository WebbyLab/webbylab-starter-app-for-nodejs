import chista from '../../../../chista.mjs';

import AdminsCreate        from '../../../../use-cases/admin/admins/Create.mjs';
import AdminsResetPassword from '../../../../use-cases/admin/admins/ResetPassword.mjs';
import AdminsList          from '../../../../use-cases/admin/admins/List.mjs';
import AdminsShow          from '../../../../use-cases/admin/admins/Show.mjs';
import AdminsDelete        from '../../../../use-cases/admin/admins/Delete.mjs';

export default {
    create        : chista.makeServiceRunner(AdminsCreate, req => req.body),
    resetPassword : chista.makeServiceRunner(AdminsResetPassword, req  => ({ ...req.body, id: req.params.id })),
    list          : chista.makeServiceRunner(AdminsList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeServiceRunner(AdminsShow, req  => ({ id: req.params.id })),
    delete        : chista.makeServiceRunner(AdminsDelete, req => ({ ...req.body, id: req.params.id }))
};
