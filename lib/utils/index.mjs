import { fileURLToPath } from 'url';
import { dirname }       from 'path';
import uuid              from 'uuid';

export function createImageName(image) {
    const nameId = uuid.v1();

    const match = image.name.match(/(.+)\.([^.]+)$/);
    const [ , imageName, imageExtension ] = match
        ? match
        : [];

    const fullImageName = `${imageName}-${nameId}.${imageExtension}`;

    return fullImageName;
}

export function getDirName(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
}
