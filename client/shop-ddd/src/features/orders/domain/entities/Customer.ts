import { Address } from '../value-objects/Address';

export class Customer {
    private constructor(
        public readonly customerId: string,
        public readonly name: string,
        public readonly email: string,
        public readonly address: Address
    ) {}

    static create(p: { customerId: string; name: string; email: string; address: Address }) {
        if (!p.customerId) throw new Error('Customer.customerId required');
        if (!p.name) throw new Error('Customer.name required');
        if (!p.email || !/^\S+@\S+\.\S+$/.test(p.email)) throw new Error('Customer.email invalid');
        if (!p.address) throw new Error('Customer.address required');
        return new Customer(p.customerId, p.name.trim(), p.email.trim(), p.address);
    }
}
