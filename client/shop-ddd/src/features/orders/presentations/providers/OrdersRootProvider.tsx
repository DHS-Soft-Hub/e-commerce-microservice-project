"use client";

import React, { useMemo } from "react";
import { OrderServiceProvider } from "./OrderServiceProvider";
import { OrderApi } from "../../infrastructure/api/OrderApi";
import { GraphQLOrderRepository } from "../../infrastructure/repositories/graphql/GraphQLOrderRespository";
import { OrderService } from "../../application/services/OrderService";

export const OrdersRootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const service = useMemo(() => {
        const api = new OrderApi();
        const repo = new GraphQLOrderRepository(api);
        return new OrderService(repo);
    }, []);

    return <OrderServiceProvider service={service}>{children}</OrderServiceProvider>;
};