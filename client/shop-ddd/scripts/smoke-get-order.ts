// scripts/smoke-get-order.ts
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../src/features/orders/infrastructure/api/__generated__/graphql';
import { mapOrderFromDto } from '../src/features/orders/domain/aggregates/mapFromDto';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:5000/graphql';

async function main() {
    const client = new GraphQLClient(API_URL);
    const sdk = getSdk(client);
    const res = await sdk.GetOrderById({ orderId: '1' });

    if (!res.order) {
        console.error('❌ No order returned');
        process.exit(1);
    }

    const order = mapOrderFromDto(res.order);
    console.log('✅ OK. Order loaded:', {
        orderId: order.orderId,
        status: order.status,
        items: order.items.length,
        total: { amount: order.totals.grandTotal.amount, currency: order.totals.grandTotal.currency }
    });
}

main().catch((e) => { console.error('❌ Error:', e); process.exit(1); });
