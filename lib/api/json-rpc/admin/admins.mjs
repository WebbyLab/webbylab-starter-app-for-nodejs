import chista from '../chista.mjs';

import AdminsCreate        from '../../../use-cases/admin/admins/Create.mjs';
import AdminsResetPassword from '../../../use-cases/admin/admins/ResetPassword.mjs';
import AdminsList          from '../../../use-cases/admin/admins/List.mjs';
import AdminsShow          from '../../../use-cases/admin/admins/Show.mjs';
import AdminsDelete        from '../../../use-cases/admin/admins/Delete.mjs';

export default {
    AdminsCreate        : chista.makeUseCaseRunner(AdminsCreate),
    AdminsResetPassword : chista.makeUseCaseRunner(AdminsResetPassword),
    AdminsList          : chista.makeUseCaseRunner(AdminsList),
    AdminsShow          : chista.makeUseCaseRunner(AdminsShow),
    AdminsDelete        : chista.makeUseCaseRunner(AdminsDelete)
};
