import { Order } from '../../../domain/aggregates/Order';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IResult, IPaginatedResult, IQueryOptions } from '@core/shared/types';

function success<T>(value: T): IResult<T> {
    return { isSuccess: true, isFailure: false, value };
}

function failure<T>(error: Error): IResult<T> {
    return { isSuccess: false, isFailure: true, error };
}
export class OrderRepository implements IOrderRepository{
    private store: Map<string, Order> = new Map();

    async findById(id: string): Promise<IResult<Order | null>> {
        return success(this.store.get(id) ?? null);
    }

    async findMany(options?: IQueryOptions): Promise<IResult<Order[]>> {
        // For demo, ignore options
        return success(Array.from(this.store.values()));
    }

    async findManyPaginated(options?: IQueryOptions): Promise<IResult<IPaginatedResult<Order>>> {
        const all = Array.from(this.store.values());
        const page = options?.pagination?.page ?? 1;
        const limit = options?.pagination?.limit ?? 10;
        const start = (page - 1) * limit;
        const data = all.slice(start, start + limit);
        const totalCount = all.length;
        const totalPages = Math.ceil(totalCount / limit);
        
        const result: IPaginatedResult<Order> = {
            data,
            totalCount,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        };
        
        return success(result);
    }

    async findFirst(options?: IQueryOptions): Promise<IResult<Order | null>> {
        // For demo, just return first
        const first = Array.from(this.store.values())[0] ?? null;
        return success(first);
    }

    async exists(id: string): Promise<IResult<boolean>> {
        return success(this.store.has(id));
    }

    async count(options?: IQueryOptions): Promise<IResult<number>> {
        return success(this.store.size);
    }

    async create(entity: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResult<Order>> {
        // For demo, assume entity has id, createdAt, updatedAt
        // @ts-ignore
        const order = entity as Order;
        this.store.set(order.id, order);
        return success(order);
    }

    async createMany(entities: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<IResult<Order[]>> {
        // @ts-ignore
        const orders = entities as Order[];
        orders.forEach(order => this.store.set(order.id, order));
        return success(orders);
    }

    async update(id: string, updates: Partial<Order>): Promise<IResult<Order>> {
        const order = this.store.get(id);
        if (!order) return failure(new Error('Order not found'));
        Object.assign(order, updates);
        this.store.set(id, order);
        return success(order);
    }

    async updateMany(options: IQueryOptions, updates: Partial<Order>): Promise<IResult<number>> {
        // For demo, update all
        let count = 0;
        for (const [id, order] of this.store.entries()) {
            Object.assign(order, updates);
            this.store.set(id, order);
            count++;
        }
        return success(count);
    }

    async delete(id: string): Promise<IResult<void>> {
        this.store.delete(id);
        return success(undefined);
    }

    async deleteMany(options?: IQueryOptions): Promise<IResult<number>> {
        const count = this.store.size;
        this.store.clear();
        return success(count);
    }

    async softDelete?(id: string): Promise<IResult<void>> {
        // Not implemented
        return success(undefined);
    }

    async restore?(id: string): Promise<IResult<void>> {
        // Not implemented
        return success(undefined);
    }
}
