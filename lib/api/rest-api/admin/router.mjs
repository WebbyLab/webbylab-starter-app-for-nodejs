import controllers from './controllers/index.mjs';

export default async (router) => {
    const checkSession = controllers.sessions.check;

    // Admins
    router.register(async (secureRouter) => {
        secureRouter.addHook('preHandler', checkSession);

        secureRouter.post('/',                  controllers.admins.create);
        secureRouter.get('/:id/resetPassword', controllers.admins.resetPassword);
        secureRouter.get('/:id',               controllers.admins.show);
        secureRouter.get('/',                   controllers.admins.list);
        secureRouter.delete('/:id',            controllers.admins.delete);
    }, { prefix: '/admins' });

    // Users
    router.register(async (secureRouter) => {
        secureRouter.addHook('preHandler', checkSession);

        secureRouter.post('/',                  controllers.users.create);
        secureRouter.get('/:id/resetPassword', controllers.users.resetPassword);
        secureRouter.get('/:id',               controllers.users.show);
        secureRouter.get('/',                   controllers.users.list);
        secureRouter.put('/:id',               controllers.users.update);
        secureRouter.delete('/:id',            controllers.users.delete);
    }, { prefix: '/users' });

    // Sessions
    router.post('/sessions', controllers.sessions.create);
};

