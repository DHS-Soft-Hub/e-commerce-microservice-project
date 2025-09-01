import { Address } from './Address';

export type ShippingMethod = 'Standard' | 'Express' | string;
export type ShippingStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Canceled';

export class Shipping {
    private constructor(
        public readonly method: ShippingMethod,
        public readonly status: ShippingStatus,
        public readonly address: Address,
        public readonly trackingNumber?: string
    ) {}

    static create(p: {
        method: ShippingMethod; status: ShippingStatus; address: Address; trackingNumber?: string;
    }) {
        if (!p.method) throw new Error('Shipping.method required');
        if (!p.status) throw new Error('Shipping.status required');
        if (!p.address) throw new Error('Shipping.address required');
        return new Shipping(p.method, p.status, p.address, p.trackingNumber);
    }
}
