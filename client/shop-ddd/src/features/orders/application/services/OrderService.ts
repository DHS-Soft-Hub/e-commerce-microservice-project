import { IOrderService } from "./IOrderService";
import { Order } from "../../domain/aggregates/Order";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";

export class OrderService implements IOrderService {
    constructor(private readonly orders: IOrderRepository) {}

    async getOrderById(orderId: string): Promise<Order | null> {
        if (!orderId || orderId.trim().length === 0) {
            throw new Error("orderId is required");
        }
        
        const result = await this.orders.findById(orderId.trim());
        
        if (result.isFailure) {
            throw new Error(result.error?.message || "Failed to find order");
        }
        
        return result.value ?? null;
    }
}
