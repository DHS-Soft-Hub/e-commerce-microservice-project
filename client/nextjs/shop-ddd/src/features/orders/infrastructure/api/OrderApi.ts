import { GraphQLClient } from 'graphql-request';
import { getSdk } from './__generated__/graphql';
import { Order } from '../../domain/aggregates/Order';
import { mapOrderFromDto } from '../../domain/aggregates/mapFromDto';

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? 'http://localhost:5000/graphql';

export class OrderApi {
    private readonly sdk: ReturnType<typeof getSdk>;

    constructor(client?: GraphQLClient) {
        const gqlClient = client ?? new GraphQLClient(API_URL, {
            // headers: { Authorization: `Bearer ${token}` } // ако ти потрябва
        });
        this.sdk = getSdk(gqlClient);
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        const res = await this.sdk.GetOrderById({ orderId });
        const dto = res.order;
        if (!dto) return null;
        return mapOrderFromDto(dto);
    }
}
