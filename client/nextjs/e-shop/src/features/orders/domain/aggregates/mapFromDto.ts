// src/features/orders/domain/aggregates/mapFromDto.ts
import { Address } from '../value-objects/Address';
import { Money } from '../value-objects/Money';
import { Payment } from '../value-objects/Payment';
import { Shipping } from '../value-objects/Shipping';
import { Totals } from '../value-objects/Totals';
import { Customer } from '../entities/Customer';
import { OrderItem } from '../entities/OrderItem';
import { Order, OrderStatus } from './Order';
import { GetOrderByIdQuery } from '../../infrastructure/api/__generated__/graphql';
import { PaymentStatus } from '../value-objects/Payment';
import { ShippingStatus } from '../value-objects/Shipping';

// Define a DTO subset type we expect (the GraphQL query returns order | null)
type OrderDto = NonNullable<GetOrderByIdQuery['order']>;
type OrderItemDto = OrderDto['orderItems'][number];

export function mapOrderFromDto(dto: OrderDto): Order {
    const currency = dto.totals.subtotal.currency; // retained in case needed later

    const customer = Customer.create({
        customerId: dto.customer.customerId,
        name: dto.customer.name,
        email: dto.customer.email,
        address: Address.create(dto.customer.address),
    });

    const items = dto.orderItems.map((it: OrderItemDto) =>
        OrderItem.create({
            productId: it.productId,
            name: it.name,
            quantity: it.quantity,
            price: Money.of(it.price.amount, it.price.currency),
            total: Money.of(it.total.amount, it.total.currency),
        })
    );

    const paymentStatus = ((): PaymentStatus => {
        const s = dto.payment.status;
        const allowed: PaymentStatus[] = ['Pending', 'Paid', 'Failed', 'Refunded'];
        return (allowed as string[]).includes(s) ? (s as PaymentStatus) : 'Pending';
    })();
    const payment = Payment.create({
        method: dto.payment.method,
        status: paymentStatus,
        transactionId: dto.payment.transactionId,
    });

    const shippingStatus = ((): ShippingStatus => {
        const s = dto.shipping.status;
        const allowed: ShippingStatus[] = ['Pending', 'Shipped', 'Delivered', 'Canceled'];
        return (allowed as string[]).includes(s) ? (s as ShippingStatus) : 'Pending';
    })();
    const shipping = Shipping.create({
        method: dto.shipping.method,
        status: shippingStatus,
        address: Address.create(dto.shipping.address),
        trackingNumber: dto.shipping.trackingNumber,
    });

    const totals = Totals.create({
        subtotal: Money.of(dto.totals.subtotal.amount, dto.totals.subtotal.currency),
        tax: Money.of(dto.totals.tax.amount, dto.totals.tax.currency),
        grandTotal: Money.of(dto.totals.grandTotal.amount, dto.totals.grandTotal.currency),
    });

    const orderStatus = ((): OrderStatus => {
        const s = dto.status;
        const allowed: OrderStatus[] = ['Pending', 'Paid', 'Shipped', 'Completed', 'Canceled'];
        return (allowed as string[]).includes(s) ? (s as OrderStatus) : 'Pending';
    })();

    return Order.create({
        id: dto.orderId,
        customer,
        items,
        payment,
        shipping,
        status: orderStatus,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
        totals,
    });
}
