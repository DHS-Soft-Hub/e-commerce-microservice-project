import { Customer } from '../entities/Customer';
import { OrderItem } from '../entities/OrderItem';
import { Address } from '../value-objects/Address';
import { Payment } from '../value-objects/Payment';
import { Shipping } from '../value-objects/Shipping';
import { Totals } from '../value-objects/Totals';
import { Money } from '../value-objects/Money';

export type OrderStatus = 'Pending' | 'Paid' | 'Shipped' | 'Completed' | 'Canceled';

export class Order {
    private constructor(
        public readonly orderId: string,
        private _customer: Customer,
        private _items: OrderItem[],
        private _payment: Payment,
        private _shipping: Shipping,
        private _status: OrderStatus,
        private _createdAt: Date,
        private _updatedAt: Date,
        private _totals: Totals
    ) {}

    // ---- Factory ----
    static create(p: {
        orderId: string;
        customer: Customer;
        items: OrderItem[];
        payment: Payment;
        shipping: Shipping;
        status: OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        totals: Totals;
    }) {
        if (!p.orderId) throw new Error('Order.orderId required');
        if (!p.customer) throw new Error('Order.customer required');
        if (!p.items?.length) throw new Error('Order.items must be non-empty');
        Order.ensureSingleCurrency(p.items);

        // totals consistency
        const subtotal = Order.calcSubtotal(p.items);
        if (p.totals.subtotal.amount !== subtotal.amount || p.totals.subtotal.currency !== subtotal.currency) {
            throw new Error('Totals.subtotal mismatch');
        }

        // status transitions minimal check
        if (!['Pending','Paid','Shipped','Completed','Canceled'].includes(p.status)) {
            throw new Error('Invalid status');
        }

        return new Order(
            p.orderId,
            p.customer,
            [...p.items],
            p.payment,
            p.shipping,
            p.status,
            new Date(p.createdAt),
            new Date(p.updatedAt),
            p.totals
        );
    }

    // ---- Invariants helpers ----
    private static ensureSingleCurrency(items: OrderItem[]) {
        const currencies = new Set(items.map(i => i.price.currency));
        if (currencies.size > 1) throw new Error('All items must have same currency');
    }

    private static calcSubtotal(items: OrderItem[]): Money {
        const currency = items[0].price.currency;
        return items.reduce(
            (sum, i) => sum.add(i.total),
            Money.of(0, currency)
        );
    }

    // ---- Readonly accessors ----
    get customer() { return this._customer; }
    get items() { return [...this._items]; }
    get payment() { return this._payment; }
    get shipping() { return this._shipping; }
    get status() { return this._status; }
    get createdAt() { return new Date(this._createdAt); }
    get updatedAt() { return new Date(this._updatedAt); }
    get totals() { return this._totals; }

    // ---- Behavior ----
    addItem(item: OrderItem) {
        if (this._status !== 'Pending') throw new Error('Can add items only in Pending');
        Order.ensureSingleCurrency([...this._items, item]);
        this._items = [...this._items, item];
        this.recalculateTotals();
        this.touch();
    }

    setPayment(payment: Payment) {
        this._payment = payment;
        if (payment.isPaid()) this._status = 'Paid';
        this.touch();
    }

    ship(method: Shipping) {
        if (this._status !== 'Paid') throw new Error('Order must be Paid before shipping');
        this._shipping = method;
        this._status = 'Shipped';
        this.touch();
    }

    complete() {
        if (this._status !== 'Shipped') throw new Error('Order must be Shipped to Complete');
        this._status = 'Completed';
        this.touch();
    }

    cancel(reason?: string) {
        if (this._status === 'Completed') throw new Error('Cannot cancel Completed order');
        this._status = 'Canceled';
        this.touch();
    }

    updateShippingAddress(address: Address) {
        this._shipping = Shipping.create({
            method: this._shipping.method,
            status: this._shipping.status,
            address,
            trackingNumber: this._shipping.trackingNumber
        });
        this.touch();
    }

    private recalculateTotals() {
        const subtotal = Order.calcSubtotal(this._items);
        // NOTE: данъчната логика тук е placeholder; в реалност би била Domain Service
        const taxRate = 0.20; // 20% ДДС за пример
        const tax = Money.of(Number((subtotal.amount * taxRate).toFixed(2)), subtotal.currency);
        const grandTotal = subtotal.add(tax);
        this._totals = Totals.create({ subtotal, tax, grandTotal });
    }

    private touch() { this._updatedAt = new Date(); }
}
