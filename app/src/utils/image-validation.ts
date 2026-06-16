import * as FileSystem from 'expo-file-system';

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

interface ImageValidationResult {
  ok: boolean;
  reason?: string;
  detectedType?: string;
}

/**
 * Client-side pre-validation of an image picked by the user.
 * Reads the first 12 bytes and checks magic numbers so the upload doesn't
 * travel to the server just to be rejected.
 *
 * Magic-number sources:
 *  - JPEG: FF D8 FF
 *  - PNG:  89 50 4E 47 0D 0A 1A 0A
 *  - WebP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
 */
export async function validateImageFile(
  uri: string,
  maxBytes = 5 * 1024 * 1024,
): Promise<ImageValidationResult> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) return { ok: false, reason: 'Arquivo não encontrado' };
    if (info.size && info.size > maxBytes) {
      return { ok: false, reason: `Arquivo excede ${maxBytes} bytes` };
    }

    // Read first 12 bytes encoded as base64 (cheaper than full read).
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
      length: 12,
      position: 0,
    });
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    let detected: string | null = null;
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      detected = 'image/jpeg';
    } else if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      detected = 'image/png';
    } else if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      detected = 'image/webp';
    }

    if (!detected) return { ok: false, reason: 'Formato não reconhecido' };
    if (!ALLOWED_TYPES.has(detected)) {
      return { ok: false, reason: `Tipo não permitido: ${detected}`, detectedType: detected };
    }

    return { ok: true, detectedType: detected };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}
