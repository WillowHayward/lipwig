// TODO: These are... not used anywhere
export interface LipwigOptions {
    port: number;
    roomNumberLimit: number;
    roomSizeLimit: number;
    name: string;
    db: string;
}

export type LipwigConfig = Partial<LipwigOptions>;
