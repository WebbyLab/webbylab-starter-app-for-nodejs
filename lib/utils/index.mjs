import { fileURLToPath } from 'url';
import { dirname }       from 'path';

export function getDirName(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
}
