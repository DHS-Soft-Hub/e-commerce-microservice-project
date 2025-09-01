export type Currency = 'EUR' | 'USD' | 'BGN' | string;

export class Money {
    private constructor(
        private readonly _amount: number,
        private readonly _currency: Currency
    ) {}

    static of(amount: number, currency: Currency) {
        if (!Number.isFinite(amount)) throw new Error('Money.amount must be finite');
        if (amount < 0) throw new Error('Money.amount must be >= 0');
        if (!currency) throw new Error('Money.currency required');
        return new Money(Number(amount.toFixed(2)), currency);
    }

    get amount() { return this._amount; }
    get currency() { return this._currency; }

    add(other: Money) {
        this.ensureSameCurrency(other);
        return Money.of(this._amount + other._amount, this._currency);
    }

    multiply(qty: number) {
        if (!Number.isInteger(qty) || qty < 0) throw new Error('qty must be integer >= 0');
        return Money.of(this._amount * qty, this._currency);
    }

    equals(other: Money) {
        return this._currency === other._currency && this._amount === other._amount;
    }

    private ensureSameCurrency(other: Money) {
        if (this._currency !== other._currency) throw new Error('Currency mismatch');
    }
}
