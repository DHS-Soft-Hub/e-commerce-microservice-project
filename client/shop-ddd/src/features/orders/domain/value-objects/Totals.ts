import { Money } from './Money';

export class Totals {
    private constructor(
        public readonly subtotal: Money,
        public readonly tax: Money,
        public readonly grandTotal: Money
    ) {}

    static create(p: { subtotal: Money; tax: Money; grandTotal: Money }) {
        const c = p.subtotal.currency;
        if (p.tax.currency !== c || p.grandTotal.currency !== c) throw new Error('Totals currency mismatch');
        if (!p.subtotal || !p.tax || !p.grandTotal) throw new Error('Totals requires all fields');
        if (Math.round((p.subtotal.amount + p.tax.amount - p.grandTotal.amount) * 100) !== 0) {
            throw new Error('grandTotal must equal subtotal + tax');
        }
        return new Totals(p.subtotal, p.tax, p.grandTotal);
    }
}
