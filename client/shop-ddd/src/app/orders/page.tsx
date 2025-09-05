"use client";

import React, { useMemo, useState } from "react";
import { OrdersList } from "../../features/orders/presentations/components/OrdersList";
import { OrdersRootProvider } from "@/features/orders/presentations/providers/OrdersRootProvider";

export default function OrdersPage() {
    const [input, setInput] = useState<string>("");
    const [ids, setIds] = useState<string[]>([]);

    const parsedIds = useMemo(() => {
        return input
            .split(/[,\s\n]+/)
            .map((x) => x.trim())
            .filter(Boolean);
    }, [input]);

    return (
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <h1>Orders</h1>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                <input
                    placeholder="Enter order IDs separated by comma or newline (e.g., 123, 456)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "10px 12px",
                        minWidth: 360,
                    }}
                />
                <button
                    onClick={() => setIds(parsedIds)}
                    disabled={parsedIds.length === 0}
                    style={{
                        border: "1px solid #ddd",
                        background: parsedIds.length ? "#111" : "#f3f4f6",
                        color: parsedIds.length ? "#fff" : "#888",
                        borderRadius: 6,
                        padding: "10px 14px",
                        cursor: parsedIds.length ? "pointer" : "not-allowed",
                    }}
                >
                    Load
                </button>
            </div>

            
            <OrdersRootProvider>
                <OrdersList orderIds={ids} />
            </OrdersRootProvider>
        </div>
    );
}