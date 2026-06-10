"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client_s3_1 = require("@aws-sdk/client-s3");
const BUCKET = process.env.MINIO_BUCKET ?? 'toqueplay';
const BANNERS_DIR = path.join(__dirname, '..', 'banners');
const client = new client_s3_1.S3Client({
    endpoint: `http${process.env.MINIO_USE_SSL === 'true' ? 's' : ''}://${process.env.MINIO_ENDPOINT ?? 'localhost'}:${process.env.MINIO_PORT ?? '9000'}`,
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    },
    forcePathStyle: true,
});
async function ensureBucket() {
    try {
        await client.send(new client_s3_1.HeadBucketCommand({ Bucket: BUCKET }));
    }
    catch {
        await client.send(new client_s3_1.CreateBucketCommand({ Bucket: BUCKET }));
    }
    const policy = {
        Version: '2012-10-17',
        Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${BUCKET}/*`] }],
    };
    await client.send(new client_s3_1.PutBucketPolicyCommand({ Bucket: BUCKET, Policy: JSON.stringify(policy) }));
}
function getPublicUrl(key) {
    const publicUrl = process.env.MINIO_PUBLIC_URL;
    if (publicUrl)
        return `${publicUrl}/${BUCKET}/${key}`;
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.MINIO_ENDPOINT ?? 'localhost';
    const port = process.env.MINIO_PORT ?? '9000';
    return `${protocol}://${host}:${port}/${BUCKET}/${key}`;
}
async function main() {
    console.log('Uploading default banners to MinIO...\n');
    await ensureBucket();
    const files = fs.readdirSync(BANNERS_DIR).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    console.log(`Found ${files.length} banner files.\n`);
    for (const file of files) {
        const filePath = path.join(BANNERS_DIR, file);
        const ext = path.extname(file).toLowerCase();
        const mimetype = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        const key = `banners/${file}`;
        const buffer = fs.readFileSync(filePath);
        await client.send(new client_s3_1.PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        }));
        const url = getPublicUrl(key);
        console.log(`  Uploaded: ${file} → ${url}`);
    }
    console.log('\nDone! All banners uploaded.');
}
main().catch((e) => { console.error('Failed:', e); process.exit(1); });
//# sourceMappingURL=seed-banners.js.map