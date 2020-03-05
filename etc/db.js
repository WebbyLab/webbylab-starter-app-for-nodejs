import { fileURLToPath } from 'url';
import { dirname }       from 'path';
import confme            from 'confme';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = confme(`${__dirname}/db.json`);

export default config;
