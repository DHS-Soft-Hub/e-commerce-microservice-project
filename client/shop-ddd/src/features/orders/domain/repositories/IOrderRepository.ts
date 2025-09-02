import { Order } from '../aggregates/Order';
import { IBaseRepository } from '@core/domain/repositories';

export interface IOrderRepository extends IBaseRepository<Order, string> {
    // Additional domain-specific methods can be added here
}
