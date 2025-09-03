import { Order } from '../../domain/aggregates/Order';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { IResult, IPaginatedResult, IQueryOptions } from '@core/shared/types';
import { OrderApi } from '../api/OrderApi';

function success<T>(value: T): IResult<T> {
    return { isSuccess: true, isFailure: false, value };
}

function failure<T>(error: Error): IResult<T> {
    return { isSuccess: false, isFailure: true, error };
}
export class OrderRepository implements IOrderRepository{
    constructor(private readonly orderApi: OrderApi) {}

    async findById(id: string): Promise<IResult<Order | null>> {
        try {
            const order = await this.orderApi.getOrderById(id);
            return { isSuccess: true, isFailure: false, value: order };
        } catch (error) {
            return { isSuccess: false, isFailure: true, error: error as Error };
        }
    }

    findMany(options?: IQueryOptions): Promise<IResult<Order[], Error>> {
        throw new Error('Method not implemented.');
    }
    findManyPaginated(options?: IQueryOptions): Promise<IResult<IPaginatedResult<Order>, Error>> {
        throw new Error('Method not implemented.');
    }
    findFirst(options?: IQueryOptions): Promise<IResult<Order | null, Error>> {
        throw new Error('Method not implemented.');
    }
    exists(id: string): Promise<IResult<boolean>> {
        throw new Error('Method not implemented.');
    }
    count(options?: IQueryOptions): Promise<IResult<number>> {
        throw new Error('Method not implemented.');
    }
    create(entity: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<IResult<Order, Error>> {
        throw new Error('Method not implemented.');
    }
    createMany(entities: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<IResult<Order[], Error>> {
        throw new Error('Method not implemented.');
    }
    update(id: string, updates: Partial<Order>): Promise<IResult<Order, Error>> {
        throw new Error('Method not implemented.');
    }
    updateMany(options: IQueryOptions, updates: Partial<Order>): Promise<IResult<number>> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<IResult<void>> {
        throw new Error('Method not implemented.');
    }
    deleteMany(options?: IQueryOptions): Promise<IResult<number>> {
        throw new Error('Method not implemented.');
    }
    softDelete?(id: string): Promise<IResult<void>> {
        throw new Error('Method not implemented.');
    }
    restore?(id: string): Promise<IResult<void>> {
        throw new Error('Method not implemented.');
    }
}
