import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/aggregates/Order';

export class OrderRepository implements IOrderRepository {
    private store: Map<string, Order> = new Map();

    async byId(id: string): Promise<Order | null> {
        return this.store.get(id) ?? null;
    }

    async save(order: Order): Promise<void> {
        this.store.set(order.orderId, order);
    }

    async delete(id: string): Promise<void> {
        this.store.delete(id);
    }
}
