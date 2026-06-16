import { assertImageFile } from './file-validation';

// Minimal valid PNG header (8 bytes signature + IHDR chunk partial)
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);

const WEBP_SIGNATURE = Buffer.from([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);

const GIF_SIGNATURE = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);

function makeFile(buffer: Buffer, mimetype = 'image/png'): Express.Multer.File {
  return {
    buffer,
    mimetype,
    originalname: 'test',
    encoding: '7bit',
    fieldname: 'file',
    size: buffer.length,
    stream: null as any,
    destination: '',
    filename: 'test',
    path: '',
  } as unknown as Express.Multer.File;
}

describe('assertImageFile', () => {
  it('accepts a valid PNG buffer', async () => {
    const file = makeFile(PNG_SIGNATURE, 'image/png');
    await expect(assertImageFile(file)).resolves.toBeUndefined();
    expect(file.mimetype).toBe('image/png');
  });

  it('accepts a valid JPEG buffer', async () => {
    const file = makeFile(JPEG_SIGNATURE, 'image/jpeg');
    await expect(assertImageFile(file)).resolves.toBeUndefined();
  });

  it('accepts a valid WebP buffer', async () => {
    const file = makeFile(WEBP_SIGNATURE, 'image/webp');
    await expect(assertImageFile(file)).resolves.toBeUndefined();
  });

  it('rejects GIF even if mimetype claims image/png', async () => {
    const file = makeFile(GIF_SIGNATURE, 'image/png');
    await expect(assertImageFile(file)).rejects.toThrow();
  });

  it('syncs detected mimetype when client lied', async () => {
    const file = makeFile(PNG_SIGNATURE, 'image/jpeg');
    await assertImageFile(file);
    expect(file.mimetype).toBe('image/png');
  });

  it('rejects empty buffer', async () => {
    await expect(assertImageFile(makeFile(Buffer.alloc(0)))).rejects.toThrow('vazio');
  });

  it('rejects oversize buffer', async () => {
    const big = Buffer.alloc(11 * 1024 * 1024, 0x89);
    await expect(assertImageFile(makeFile(big), 10 * 1024 * 1024)).rejects.toThrow('tamanho máximo');
  });
});
