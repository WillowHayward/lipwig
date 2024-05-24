const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateString(length = 4, characters = ALPHABET): string {
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
