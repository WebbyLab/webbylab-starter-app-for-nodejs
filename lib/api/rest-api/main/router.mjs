import controllers from './controllers/index.mjs';

export default async (router) => {
    const checkSession = controllers.sessions.check;

    router.register(async (secureRouter) => {
        secureRouter.addHook('preHandler', checkSession);

        secureRouter.get('/:id',    controllers.users.show);
        secureRouter.get('/',       controllers.users.list);
        secureRouter.put('/:id',    controllers.users.update);
        secureRouter.delete('/:id', controllers.users.delete);
    }, { prefix: '/users' });

    // Actions
    router.post('/actions/:id', controllers.actions.submit);

    // Sessions
    router.post('/sessions', controllers.sessions.create);

    // Users
    router.post('/users',               controllers.users.create);
    router.post('/users/resetPassword', controllers.users.resetPassword);

    // Files
    router.register(async (secureRouter) => {
        secureRouter.addHook('preHandler', checkSession);

        secureRouter.post('/:type', controllers.files.create);
    }, { prefix: '/files' });

    // {{GENERATE_NEW_DATA_BELOW}}
};
