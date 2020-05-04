import chista from '../chista.mjs';

import UsersCreate        from '../../../use-cases/main/users/Create.mjs';
import UsersUpdate        from '../../../use-cases/main/users/Update.mjs';
import UsersResetPassword from '../../../use-cases/main/users/ResetPassword.mjs';
import UsersList          from '../../../use-cases/main/users/List.mjs';
import UsersShow          from '../../../use-cases/main/users/Show.mjs';
import UsersDelete        from '../../../use-cases/main/users/Delete.mjs';

export default {
    UsersCreate        : chista.makeUseCaseRunner(UsersCreate),
    UsersUpdate        : chista.makeUseCaseRunner(UsersUpdate),
    UsersResetPassword : chista.makeUseCaseRunner(UsersResetPassword),
    UsersList          : chista.makeUseCaseRunner(UsersList),
    UsersShow          : chista.makeUseCaseRunner(UsersShow),
    UsersDelete        : chista.makeUseCaseRunner(UsersDelete)
};
