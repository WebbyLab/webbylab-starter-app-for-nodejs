import config from './../../etc/config.js';

export function dumpUser(user) {
    const dump = {
        id             : user.id,
        firstName      : user.firstName,
        secondName     : user.secondName,
        avatarUrl      : user.avatar ? `${config.url}${user.avatar}` : '',
        followersCount : user.followersCount,
        followedCount  : user.followedCount,
        role           : user.role,
        lang           : user.lang,
        createdAt      : user.createdAt,
        updatedAt      : user.updatedAt
    };

    return dump;
}


export function dumpTweet(tweet) {
    const dump = {
        id        : tweet.id,
        userId    : tweet.userId,
        title     : tweet.title,
        subtitle  : tweet.subtitle,
        text      : tweet.text,
        image     : tweet.image,
        createdAt : tweet.createdAt,
        updatedAt : tweet.updatedAt,
        createdBy : tweet.createdBy
    };

    return dump;
}


export function dumpLike(like) {
    const dump = {
        id        : like.id,
        createdBy : like.createdBy,
        subject   : like.subject
    };

    return dump;
}


export function dumpComment(comment) {
    const dump = {
        id        : comment.id,
        text      : comment.text,
        createdBy : comment.createdBy,
        subject   : comment.subject
    };

    return dump;
}


export function dumpRetweet(retweet) {
    const dump = {
        id        : retweet.id,
        createdBy : retweet.createdBy,
        subject   : retweet.subject
    };

    return dump;
}


export function dumpImage(name, url) {
    return {
        id : name.split('.')[0],
        url
    };
}
