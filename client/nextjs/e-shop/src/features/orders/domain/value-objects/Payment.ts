export type PaymentMethod = 'CreditCard' | 'PayPal' | 'BankTransfer' | string;
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export class Payment {
    private constructor(
        public readonly method: PaymentMethod,
        public readonly status: PaymentStatus,
        public readonly transactionId?: string
    ) {}

    static create(p: { method: PaymentMethod; status: PaymentStatus; transactionId?: string }) {
        if (!p.method) throw new Error('Payment.method required');
        if (!p.status) throw new Error('Payment.status required');
        return new Payment(p.method, p.status, p.transactionId);
    }

    isPaid() { return this.status === 'Paid'; }
}
