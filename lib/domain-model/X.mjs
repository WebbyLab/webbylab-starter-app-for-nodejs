export class BaseError extends Error {
    constructor(args = {}) {
        super();

        if (!args.message) /* c8 ignore next */ throw new Error('"message" is required');
        if (!args.field) /* c8 ignore next */ throw new Error('"field" required');

        this.message = args.message;
        this.field   = args.field;
        this.parent  = args.parent;
    }
}

export class WrongId extends BaseError { }
export class NotUnique extends BaseError { }
export class Fatal extends BaseError { }
export class InactiveObject extends BaseError { }
export class WrongParameterValue extends BaseError { }

export default {
    BaseError,
    NotUnique,
    WrongId,
    InactiveObject,
    WrongParameterValue,
    Fatal
};
