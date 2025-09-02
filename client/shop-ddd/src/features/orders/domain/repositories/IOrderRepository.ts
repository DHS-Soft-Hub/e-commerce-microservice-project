import { Order } from '../aggregates/Order';

export interface IOrderRepository {
    byId(id: string): Promise<Order | null>;
    save(order: Order): Promise<void>;
    delete(id: string): Promise<void>;
}
