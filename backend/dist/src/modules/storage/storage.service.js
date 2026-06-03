"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
let StorageService = class StorageService {
    client;
    bucket;
    constructor() {
        this.bucket = process.env.MINIO_BUCKET ?? 'toqueplay';
        this.client = new client_s3_1.S3Client({
            endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT ?? 'localhost'}:${process.env.MINIO_PORT ?? '9000'}`,
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'toqueplayadmin',
                secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'toqueplaysecret',
            },
            forcePathStyle: true,
        });
    }
    async onModuleInit() {
        await this.ensureBucket();
    }
    async ensureBucket() {
        try {
            await this.client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucket }));
        }
        catch {
            await this.client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucket }));
        }
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${this.bucket}/*`],
                },
            ],
        };
        await this.client.send(new client_s3_1.PutBucketPolicyCommand({
            Bucket: this.bucket,
            Policy: JSON.stringify(policy),
        }));
        console.log('[Storage] public read policy applied to bucket:', this.bucket);
    }
    getPublicUrl(key) {
        const publicUrl = process.env.MINIO_PUBLIC_URL;
        if (publicUrl)
            return `${publicUrl}/${this.bucket}/${key}`;
        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
        const host = process.env.MINIO_ENDPOINT ?? 'localhost';
        const port = process.env.MINIO_PORT ?? '9000';
        return `${protocol}://${host}:${port}/${this.bucket}/${key}`;
    }
    async uploadFile(buffer, key, mimetype) {
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        }));
        const url = this.getPublicUrl(key);
        console.log('[Storage] uploaded:', key, '→ public url:', url);
        return url;
    }
    async deleteFile(key) {
        try {
            await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
        }
        catch {
        }
    }
    extractKeyFromUrl(url) {
        const prefix = `/${this.bucket}/`;
        const idx = url.indexOf(prefix);
        if (idx === -1)
            return null;
        return url.substring(idx + prefix.length);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map