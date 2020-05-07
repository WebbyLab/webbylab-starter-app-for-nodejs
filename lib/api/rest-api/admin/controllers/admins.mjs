import chista from '../../chista.mjs';

import AdminsCreate        from '../../../../use-cases/admin/admins/Create.mjs';
import AdminsResetPassword from '../../../../use-cases/admin/admins/ResetPassword.mjs';
import AdminsList          from '../../../../use-cases/admin/admins/List.mjs';
import AdminsShow          from '../../../../use-cases/admin/admins/Show.mjs';
import AdminsDelete        from '../../../../use-cases/admin/admins/Delete.mjs';

export default {
    create        : chista.makeUseCaseRunner(AdminsCreate, req => req.body),
    resetPassword : chista.makeUseCaseRunner(AdminsResetPassword, req  => ({ ...req.body, id: req.params.id })),
    list          : chista.makeUseCaseRunner(AdminsList, req => ({ ...req.query, ...req.params })),
    show          : chista.makeUseCaseRunner(AdminsShow, req  => ({ id: req.params.id })),
    delete        : chista.makeUseCaseRunner(AdminsDelete, req => ({ ...req.body, id: req.params.id }))
};
