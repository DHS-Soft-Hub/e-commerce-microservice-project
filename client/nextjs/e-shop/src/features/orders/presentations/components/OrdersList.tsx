"use client";

import React, { useMemo, useState } from "react";
import { useOrder } from "../hooks/useOrder";
import { OrderDialog } from "./OrderDialog";

type OrdersListProps = {
    orderIds: string[];
};

function formatMoney(m?: { amount: number; currency: string }) {
    if (!m) return "-";
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: m.currency || "USD",
            maximumFractionDigits: 2,
        }).format(m.amount);
    } catch {
        return `${m.amount} ${m.currency}`;
    }
}

type OrderRowProps = {
    id: string;
    openId: string | null;
    setOpenId: React.Dispatch<React.SetStateAction<string | null>>;
};

const OrderRow: React.FC<OrderRowProps> = ({ id, openId, setOpenId }) => {
    // Hook is now inside its own component, satisfying Rules of Hooks
    const { order, loading, error } = useOrder(id);

    return (
        <div
            style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "center",
            }}
        >
            <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Order ID: {id}</div>
                {loading && <div style={{ opacity: 0.8 }}>Loading…</div>}
                {error && <div style={{ color: "#b91c1c" }}>Error: {error.message}</div>}
                {!loading && !error && !order && <div>Not found.</div>}

                {!loading && !error && order && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                        <div>
                            <div><strong>Status:</strong> {order.status}</div>
                            <div>
                                <strong>Created:</strong>{" "}
                                {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                            </div>
                        </div>
                        <div>
                            <div><strong>Customer:</strong> {order.customer?.name ?? "-"}</div>
                            <div><strong>Email:</strong> {order.customer?.email ?? "-"}</div>
                        </div>
                        <div>
                            <div><strong>Subtotal:</strong> {formatMoney(order.totals?.subtotal)}</div>
                            <div><strong>Grand Total:</strong> {formatMoney(order.totals?.grandTotal)}</div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <button
                    onClick={() => setOpenId(id)}
                    disabled={loading || !!error || !order}
                    style={{
                        border: "1px solid #ddd",
                        background: "#111",
                        color: "#fff",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: loading || !!error || !order ? "not-allowed" : "pointer",
                    }}
                >
                    View
                </button>
            </div>

            <OrderDialog
                open={openId === id}
                orderId={id}
                onClose={() => setOpenId(null)}
                title="Order Details"
            />
        </div>
    );
};

export const OrdersList: React.FC<OrdersListProps> = ({ orderIds }) => {
    const [openId, setOpenId] = useState<string | null>(null);

    const ids = useMemo(
        () => orderIds.map((x) => x.trim()).filter(Boolean),
        [orderIds]
    );

    if (ids.length === 0) {
        return <div style={{ padding: 8, color: "#6b7280" }}>No order IDs provided.</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ids.map((id) => (
                <OrderRow key={id} id={id} openId={openId} setOpenId={setOpenId} />
            ))}
        </div>
    );
};