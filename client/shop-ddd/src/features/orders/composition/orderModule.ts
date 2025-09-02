import { OrderService } from "../application/services/OrderService";
import { IOrderService } from "../application/services/IOrderService";
import { OrderRepository } from "../infrastructure/repositories/inmemory/OrderRepository"; // твоята имплементация
import { IOrderRepository } from "../domain/repositories/IOrderRepository";

export function createOrderService(): IOrderService {
    const repo: IOrderRepository = new OrderRepository();
    return new OrderService(repo);
}
