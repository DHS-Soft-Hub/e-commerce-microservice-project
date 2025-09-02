"use client";

import { useEffect, useState } from "react";
import { useOrderService } from "../providers/OrderServiceProvider";
import type { Order } from "../../domain/aggregates/Order";

export function useOrder(orderId: string) {
    const orderService = useOrderService();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchOrder() {
            try {
                setLoading(true);
                setError(null);
                const data = await orderService.getOrderById(orderId);
                if (isMounted) setOrder(data);
            } catch (err) {
                if (isMounted) setError(err as Error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (orderId) {
            fetchOrder();
        } else {
            setOrder(null);
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [orderId, orderService]);

    return { order, loading, error };
}