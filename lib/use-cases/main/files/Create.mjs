/* istanbul ignore file */
import path               from 'path';
import uuid               from 'uuid';
import Base               from '../../Base.mjs';
import s3, { BucketName } from '../../../infrastructure/s3.mjs';
import {
    Exception as X
} from '../../../../packages.mjs';

const MIME_TYPE_RULES = {
    images : { 'one_of': [ 'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml' ] },
    chat   : { 'one_of' : [
        'image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',        // .doc + .docx
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',        // .xls + .xlsx
        'application/x-rar-compressed', 'application/octet-stream',                                             // .rar
        'application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'application/x-zip',     // .zip
        'application/pdf', 'text/plain', 'text/csv'
    ] }
};

export default class FileCreate extends Base {
    async validate(data) {
        const rules = {
            type     : [ 'required', { 'one_of': [ 'images', 'chat' ] } ],
            file     : [ 'required' ],
            filename : [ 'required' ],
            mimetype : [ 'required', MIME_TYPE_RULES[data.type] || 'not_empty' ]
        };

        return this.doValidation(data, rules);
    }

    async execute({ type, file, filename, mimetype }) {
        const extention      = path.extname(filename);
        const remoteFileName = `${uuid.v4()}${extention}`;
        const params = {
            Bucket      : BucketName,
            Key         : `${type}/${remoteFileName}`,
            Body        : file,
            ContentType : mimetype
        };

        try {
            const data = await s3.uploadAsync(params);
            const storedFile = ({
                name         : remoteFileName,
                originalName : filename,
                key          : data.Key,
                location     : BucketName,
                extention,
                type
            });

            return { data: storedFile };
        } catch (error) {
            throw new X({
                code   : 'FAILED_TO_DOWNLOAD',
                fields : {
                    file : 'BAD_FILE'
                }
            });
        }
    }
}
