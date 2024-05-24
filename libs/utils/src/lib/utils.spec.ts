import { generateString } from './utils';

describe('generateString', () => {
    it('should generate a string of default length 4', () => {
        const result = generateString();
        expect(result).toHaveLength(4);
    });

    it('should generate a string of specified length', () => {
        const result = generateString(6);
        expect(result).toHaveLength(6);
    });

    it('should generate a string using default characters', () => {
        const result = generateString();
        expect(result).toMatch(/^[A-Z]{4}$/);
    });

    it('should generate a string using specified characters', () => {
        const result = generateString(4, '123');
        expect(result).toMatch(/^[123]{4}$/);
    });
});
