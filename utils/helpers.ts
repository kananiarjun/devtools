/**
 * DevTools Hub – Shared Helpers
 */

export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

export function isValidJson(json: string): boolean {
    try {
        JSON.parse(json);
        return true;
    } catch {
        return false;
    }
}

export function formatJson(json: string): string {
    return JSON.stringify(JSON.parse(json), null, 2);
}

export function generatePassword(
    length: number,
    useSymbols: boolean,
    useNumbers: boolean
): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = letters;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
