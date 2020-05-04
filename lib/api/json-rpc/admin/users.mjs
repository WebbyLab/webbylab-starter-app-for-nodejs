import chista from '../chista.mjs';

import UsersCreate        from '../../../use-cases/admin/users/Create.mjs';
import UsersUpdate        from '../../../use-cases/admin/users/Update.mjs';
import UsersResetPassword from '../../../use-cases/admin/users/ResetPassword.mjs';
import UsersList          from '../../../use-cases/admin/users/List.mjs';
import UsersShow          from '../../../use-cases/admin/users/Show.mjs';
import UsersDelete        from '../../../use-cases/admin/users/Delete.mjs';

export default {
    AdminUsersCreate        : chista.makeUseCaseRunner(UsersCreate),
    AdminUsersUpdate        : chista.makeUseCaseRunner(UsersUpdate),
    AdminUsersResetPassword : chista.makeUseCaseRunner(UsersResetPassword),
    AdminUsersList          : chista.makeUseCaseRunner(UsersList),
    AdminUsersShow          : chista.makeUseCaseRunner(UsersShow),
    AdminUsersDelete        : chista.makeUseCaseRunner(UsersDelete)
};
