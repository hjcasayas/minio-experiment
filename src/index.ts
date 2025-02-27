import { Client } from 'minio';
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

config();
const minio = new Client({
    endPoint: process.env.MINIO_END_POINT!,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: true
});

const listBuckets = async (client: Client) => {
    try {
        const buckets = await client.listBuckets();
        console.log({ buckets });
    } catch (error) {
        console.log('Error listing buckets.', JSON.stringify(error));
    }
};

const makeBucket = async (client: Client) => {
    try {
        const createdBucket = await client.makeBucket('minio-experiment-bucket', undefined, { ObjectLocking: true });
        console.log({ createdBucket });
    } catch (error) {
        console.log('Error making bucket.', JSON.stringify(error));
    }
};

const uploadFile = async (client: Client, bucketName: string, fileName: string, filePath: string) => {
    try {
        const uploadedFile = await client.fPutObject(bucketName, fileName, filePath);
        console.log('Successfully uploaded file.');
        console.log({ uploadedFile });
    } catch (error) {
        console.log('Error making bucket.', JSON.stringify(error));
    }
};

const downloadFile = async (client: Client, bucketName: string, fileName: string, filePath: string) => {
    try {
        const downloadedFile = await client.fGetObject(bucketName, fileName, filePath);
        console.log('Successfully downloaded file.');
        console.log({ downloadedFile });
    } catch (error) {
        console.log('Error making bucket.', JSON.stringify(error));
    }
};

const presignedUrl = async (client: Client, bucketName: string, fileName: string) => {
    try {
        const signedURL = await client.presignedUrl('GET', bucketName, fileName);
        console.log('Successfully generated url.');
        console.log({ signedURL });
    } catch (error) {
        console.log('Error making bucket.', JSON.stringify(error));
    }
};

const mdf = {
    listBuckets,
    makeBucket,
    uploadFile,
    downloadFile,
    presignedUrl,
}

mdf.listBuckets(minio);
mdf.makeBucket(minio);
mdf.uploadFile(minio, 'minio-experiment-bucket', 'file.txt', path.resolve(path.dirname(fileURLToPath(import.meta.url))
    , '../file.txt'));
mdf.downloadFile(minio, 'minio-experiment-bucket', 'file.txt', path.resolve(path.dirname(fileURLToPath(import.meta.url))
    , '../new-file.txt'));
mdf.presignedUrl(minio, 'minio-experiment-bucket', 'file.txt');