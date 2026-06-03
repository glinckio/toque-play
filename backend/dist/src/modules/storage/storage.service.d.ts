import { OnModuleInit } from '@nestjs/common';
export declare class StorageService implements OnModuleInit {
    private readonly client;
    private readonly bucket;
    constructor();
    onModuleInit(): Promise<void>;
    private ensureBucket;
    private getPublicUrl;
    uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    extractKeyFromUrl(url: string): string | null;
}
