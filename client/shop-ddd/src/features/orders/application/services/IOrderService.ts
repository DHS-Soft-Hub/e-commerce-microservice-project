import { Order } from "../../domain/aggregates/Order";

export interface IOrderService {
    /**
     * Returns the Order aggregate by ID, or null if not found.
     * The Application layer not perform business logic, only orchestration/input validation.
     */
    getOrderById(orderId: string): Promise<Order | null>;
}
