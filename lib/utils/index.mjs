import uuid                  from 'uuid';

import * as includeUtils     from './includes';
import * as dumpUtils        from './dumps';


export function createImageName(image) {
    const nameId = uuid.v1();

    const match = image.name.match(/(.+)\.([^.]+)$/);
    const [ , imageName, imageExtension ] = match
        ? match
        : [];

    const fullImageName = `${imageName}-${nameId}.${imageExtension}`;

    return fullImageName;
}

export {
    includeUtils,
    dumpUtils
};
