import { OrderService } from "../application/services/OrderService";
import { IOrderService } from "../application/services/IOrderService";
// ... existing code ...
import { IOrderRepository } from "../domain/repositories/IOrderRepository";
// ... existing code ...
import { GraphQLOrderRepository } from "../infrastructure/repositories/graphql/GraphQLOrderRespository";
import { OrderApi } from "../infrastructure/api/OrderApi";

// ... existing code ...

export function createOrderService(): IOrderService {
    const api = new OrderApi();
    const repo: IOrderRepository = new GraphQLOrderRepository(api);
    return new OrderService(repo);
}