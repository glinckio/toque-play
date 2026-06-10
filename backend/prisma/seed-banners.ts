import * as fs from 'fs';
import * as path from 'path';
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';

const BUCKET = process.env.MINIO_BUCKET ?? 'toqueplay';
const BANNERS_DIR = path.join(__dirname, '..', 'banners');

const client = new S3Client({
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
    await client.send(new HeadBucketCommand({ Bucket: BUCKET }));
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: BUCKET }));
  }
  const policy = {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${BUCKET}/*`] }],
  };
  await client.send(new PutBucketPolicyCommand({ Bucket: BUCKET, Policy: JSON.stringify(policy) }));
}

function getPublicUrl(key: string): string {
  const publicUrl = process.env.MINIO_PUBLIC_URL;
  if (publicUrl) return `${publicUrl}/${BUCKET}/${key}`;
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

    await client.send(new PutObjectCommand({
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
