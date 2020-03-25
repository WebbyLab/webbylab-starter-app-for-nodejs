import UsersCreate from '../../../../lib/use-cases/users/Create.mjs';

// export const serviceClass = UsersCreate;
// export async function before(factory) {
//     await factory.standardSetup();
//     await factory.setupUsers();
// }

export default {
    serviceClass : UsersCreate,
    before       : async (factory) => {
        await factory.standardSetup();
        await factory.setupUsers();
    }
};
