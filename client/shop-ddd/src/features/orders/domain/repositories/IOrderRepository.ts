import { Order } from '../aggregates/Order';
import { IBaseRepository } from '@core/domain/repositories';

export interface IOrderRepository extends IBaseRepository<Order, string> {
    /**
     * Returns all orders for a given customer id.
     * Keeping it simple (no IResult wrapper) to avoid forcing implementations yet.
     */
    findByCustomerId(customerId: string): Promise<Order[]>;
}
