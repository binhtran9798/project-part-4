import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    ) {}

    getAttachmentUrl(todoId: string) {
        return `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`;
    }

    getDocumentClient(){
        return new XAWS.DynamoDB.DocumentClient();
    }

    getFileUploadedUrl(todoId: string): string {
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: todoId,
            Expires: process.env.SIGNED_URL_EXPIRATION
        })
        return url as string;
    }
}