export class Address {
    private constructor(
        public readonly street: string,
        public readonly city: string,
        public readonly postalCode: string,
        public readonly country: string
    ) {}

    static create(p: { street: string; city: string; postalCode: string; country: string }) {
        for (const [k, v] of Object.entries(p)) {
            if (!v || String(v).trim().length === 0) throw new Error(`Address.${k} required`);
        }
        return new Address(p.street.trim(), p.city.trim(), p.postalCode.trim(), p.country.trim());
    }
}
