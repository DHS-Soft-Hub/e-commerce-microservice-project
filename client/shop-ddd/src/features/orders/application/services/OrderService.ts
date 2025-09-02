import { IOrderService } from "./IOrderService";
import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/aggregates/Order";

export class OrderService implements IOrderService {
    constructor(private readonly orders: IOrderRepository) {}

    async getOrderById(orderId: string): Promise<Order | null> {
        if (!orderId || orderId.trim().length === 0) {
            throw new Error("orderId is required");
        }
        return this.orders.byId(orderId.trim());
    }
}
