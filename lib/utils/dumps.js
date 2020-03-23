import { generateImagesURL } from './imagesURLGeneration.js';

export function dumpUser(user) {
    const dump = {
        id             : user.id,
        firstName      : user.firstName,
        secondName     : user.secondName,
        avatarUrl      : user.avatar ? generateImagesURL(user.avatar) : '',
        followersCount : user.followersCount,
        followedCount  : user.followedCount,
        lang           : user.lang,
        createdAt      : user.createdAt,
        updatedAt      : user.updatedAt
    };

    return dump;
}
