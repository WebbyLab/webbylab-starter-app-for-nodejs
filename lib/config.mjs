import confme         from 'confme';
import { getDirName } from '../lib/utils/index.mjs';

const __dirname = getDirName(import.meta.url);

const config = confme(`${__dirname}/../etc/config.json`);

export default config;
