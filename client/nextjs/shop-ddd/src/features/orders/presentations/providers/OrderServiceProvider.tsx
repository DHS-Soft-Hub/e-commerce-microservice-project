"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { IOrderService } from "../../application/services/IOrderService";
import { OrderService } from "../../application/services/OrderService";

type OrderServiceFactory = () => IOrderService;

interface OrderServiceProviderProps {
    children: React.ReactNode;
    service?: IOrderService;
    createService?: OrderServiceFactory;
}

const OrderServiceContext = createContext<IOrderService | null>(null);

/**
 * OrderServiceProvider
 * - Provides an instance of IOrderService to the component tree.
 * - You can pass a ready service instance via `service`, or a factory via `createService`.
 * - If neither is provided, an error is thrown to make dependency wiring explicit.
 */
export const OrderServiceProvider: React.FC<OrderServiceProviderProps> = ({
                                                                              children,
                                                                              service,
                                                                              createService,
                                                                          }) => {
    const value = useMemo<IOrderService>(() => {
        if (service) return service;
        if (createService) return createService();

        // If you want a default creation here, you must have access to a concrete IOrderRepository implementation.
        // Example:
        // import { OrderRepository } from "../../infrastructure/repositories/OrderRepository";
        // const repo = new OrderRepository(/* deps */);
        // return new OrderService(repo);

        throw new Error(
            "OrderServiceProvider: either `service` or `createService` must be provided."
        );
    }, [service, createService]);

    return (
        <OrderServiceContext.Provider value={value}>
            {children}
        </OrderServiceContext.Provider>
    );
};

export const useOrderService = (): IOrderService => {
    const ctx = useContext(OrderServiceContext);
    if (!ctx) {
        throw new Error("useOrderService must be used within OrderServiceProvider");
    }
    return ctx;
};