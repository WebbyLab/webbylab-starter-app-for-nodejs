import AWS           from 'aws-sdk';
import { promisify } from '../../packages.mjs';
import config        from '../config.cjs';

const s3client = new AWS.S3(config.s3);

s3client.uploadAsync = promisify(s3client.upload);
// const s3Async = promisifyAll(s3client);

export default s3client;
export const BucketName  = config.s3.bucket;
