import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Order } from "../../../domain/aggregates/Order";
import { OrderApi } from "../../api/OrderApi";

export class GraphQLOrderRepository implements IOrderRepository {
    constructor(private readonly api = new OrderApi()) {}

    async byId(id: string): Promise<Order | null> {
        return this.api.getOrderById(id);
    }
    async save(_order: Order): Promise<void> {
        throw new Error("Not implemented in GraphQL repo");
    }
    async delete(_id: string): Promise<void> {
        throw new Error("Not implemented in GraphQL repo");
    }
}