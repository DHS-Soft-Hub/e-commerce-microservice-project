// src/features/orders/domain/aggregates/mapFromDto.ts
import { Address } from '../value-objects/Address';
import { Money } from '../value-objects/Money';
import { Payment } from '../value-objects/Payment';
import { Shipping } from '../value-objects/Shipping';
import { Totals } from '../value-objects/Totals';
import { Customer } from '../entities/Customer';
import { OrderItem } from '../entities/OrderItem';
import { Order } from './Order';

export function mapOrderFromDto(dto: any): Order {
    const currency = dto.totals.subtotal.currency;

    const customer = Customer.create({
        customerId: dto.customer.customerId,
        name: dto.customer.name,
        email: dto.customer.email,
        address: Address.create(dto.customer.address),
    });

    const items = dto.orderItems.map((it: any) =>
        OrderItem.create({
            productId: it.productId,
            name: it.name,
            quantity: it.quantity,
            price: Money.of(it.price.amount, it.price.currency),
            total: Money.of(it.total.amount, it.total.currency),
        })
    );

    const payment = Payment.create({
        method: dto.payment.method,
        status: dto.payment.status,
        transactionId: dto.payment.transactionId,
    });

    const shipping = Shipping.create({
        method: dto.shipping.method,
        status: dto.shipping.status,
        address: Address.create(dto.shipping.address),
        trackingNumber: dto.shipping.trackingNumber,
    });

    const totals = Totals.create({
        subtotal: Money.of(dto.totals.subtotal.amount, dto.totals.subtotal.currency),
        tax: Money.of(dto.totals.tax.amount, dto.totals.tax.currency),
        grandTotal: Money.of(dto.totals.grandTotal.amount, dto.totals.grandTotal.currency),
    });

    return Order.create({
        orderId: dto.orderId,
        customer,
        items,
        payment,
        shipping,
        status: dto.status,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        totals,
    });
}
