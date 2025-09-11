import { Money } from '../value-objects/Money';

export class OrderItem {
    private constructor(
        public readonly productId: string,
        public readonly name: string,
        public readonly quantity: number,
        public readonly price: Money, // unit price
        public readonly total: Money  // price * quantity
    ) {}

    static create(p: { productId: string; name: string; quantity: number; price: Money; total?: Money }) {
        if (!p.productId) throw new Error('OrderItem.productId required');
        if (!p.name) throw new Error('OrderItem.name required');
        if (!Number.isInteger(p.quantity) || p.quantity < 1) throw new Error('quantity >= 1');
        if (!p.price) throw new Error('OrderItem.price required');

        const expectedTotal = p.price.multiply(p.quantity);
        const total = p.total ?? expectedTotal;

        if (!total.equals(expectedTotal)) {
            throw new Error('OrderItem.total must equal price * quantity');
        }
        return new OrderItem(p.productId, p.name.trim(), p.quantity, p.price, total);
    }
}
