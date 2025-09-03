"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useOrder } from "../hooks/useOrder";

type OrderDialogProps = {
    open: boolean;
    orderId?: string | null;
    onClose: () => void;
    title?: string;
};

function formatMoney(m?: { amount: number; currency: string }) {
    if (!m) return "-";
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: m.currency || "USD",
            currencyDisplay: "symbol",
            maximumFractionDigits: 2,
        }).format(m.amount);
    } catch {
        return `${m.amount} ${m.currency}`;
    }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, opacity: 0.9 }}>
                {title}
            </h3>
            <div>{children}</div>
        </section>
    );
}

export const OrderDialog: React.FC<OrderDialogProps> = ({
                                                            open,
                                                            orderId,
                                                            onClose,
                                                            title = "Order Details",
                                                        }) => {
    const id = orderId ?? "";
    const { order, loading, error } = useOrder(id);
    const dialogRef = useRef<HTMLDivElement>(null);
    const initialFocusRef = useRef<HTMLButtonElement>(null);

    // Lock background scroll when modal is open
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [open]);

    // ESC to close and simple focus trap
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
            if (e.key === "Tab" && dialogRef.current) {
                const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Focus on Close button when opened
    useEffect(() => {
        if (open) {
            initialFocusRef.current?.focus();
        }
    }, [open]);

    const headerTitle = useMemo(() => {
        if (order?.orderId) return `${title} • #${order.orderId}`;
        return title;
    }, [title, order?.orderId]);

    // Safely read items if present on the order shape
    const items = useMemo(() => {
        const maybeItems = (order as any)?.orderItems;
        return Array.isArray(maybeItems) ? (maybeItems as any[]) : undefined;
    }, [order]);

    if (!open) return null;

    return (
        <div
            aria-hidden={!open}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 12,
            }}
            onMouseDown={(e) => {
                // close when clicking outside the modal
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-dialog-title"
                style={{
                    width: "min(100%, 920px)",
                    maxHeight: "85vh",
                    background: "white",
                    color: "#111",
                    borderRadius: 8,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <header
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                    }}
                >
                    <h2 id="order-dialog-title" style={{ margin: 0, fontSize: 18 }}>
                        {headerTitle}
                    </h2>
                    <button
                        ref={initialFocusRef}
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            border: "1px solid #ddd",
                            background: "white",
                            borderRadius: 6,
                            padding: "6px 10px",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </header>

                <div style={{ padding: 16, overflow: "auto" }}>
                    {!id && (
                        <div style={{ padding: 8, color: "#b91c1c" }}>
                            No orderId provided. Please select an order.
                        </div>
                    )}

                    {loading && (
                        <div style={{ padding: 8, opacity: 0.8 }}>Loading order…</div>
                    )}

                    {error && (
                        <div style={{ padding: 8, color: "#b91c1c" }}>
                            Error: {error.message}
                        </div>
                    )}

                    {!loading && !error && order == null && id && (
                        <div style={{ padding: 8 }}>Order not found.</div>
                    )}

                    {!loading && !error && order && (
                        <>
                            <Section title="Overview">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <div><strong>ID:</strong> {order.orderId}</div>
                                        <div><strong>Status:</strong> {order.status}</div>
                                    </div>
                                    <div>
                                        <div>
                                            <strong>Created:</strong>{" "}
                                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                                        </div>
                                        <div>
                                            <strong>Updated:</strong>{" "}
                                            {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "-"}
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Customer">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <div><strong>Name:</strong> {order.customer?.name ?? "-"}</div>
                                        <div><strong>Email:</strong> {order.customer?.email ?? "-"}</div>
                                        <div><strong>Customer ID:</strong> {order.customer?.customerId ?? "-"}</div>
                                    </div>
                                    <div>
                                        <div><strong>Address:</strong></div>
                                        <div>
                                            {[
                                                order.customer?.address?.street,
                                                order.customer?.address?.postalCode,
                                                order.customer?.address?.city,
                                                order.customer?.address?.country,
                                            ]
                                                .filter(Boolean)
                                                .join(", ") || "-"}
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* Render Items section only if items exist on the order shape */}
                            {items && (
                                <Section title="Items">
                                    {items.length ? (
                                        <div style={{ overflowX: "auto" }}>
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                <tr>
                                                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Product</th>
                                                    <th style={{ textAlign: "left", borderBottom: "1px solid #eee", padding: 8 }}>Qty</th>
                                                    <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>Price</th>
                                                    <th style={{ textAlign: "right", borderBottom: "1px solid #eee", padding: 8 }}>Total</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {items.map((it: any) => (
                                                    <tr key={`${it.productId ?? it.name ?? Math.random()}`}>
                                                        <td style={{ padding: 8 }}>
                                                            <div style={{ fontWeight: 600 }}>{it.name ?? "-"}</div>
                                                            {it.productId && (
                                                                <div style={{ opacity: 0.7, fontSize: 12 }}>SKU: {it.productId}</div>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: 8 }}>{it.quantity ?? "-"}</td>
                                                        <td style={{ padding: 8, textAlign: "right" }}>{formatMoney(it.price)}</td>
                                                        <td style={{ padding: 8, textAlign: "right" }}>{formatMoney(it.total)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div>No items.</div>
                                    )}
                                </Section>
                            )}

                            <Section title="Totals">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                                    <div><strong>Subtotal:</strong> {formatMoney(order.totals?.subtotal)}</div>
                                    <div><strong>Tax:</strong> {formatMoney(order.totals?.tax)}</div>
                                    <div><strong>Grand Total:</strong> {formatMoney(order.totals?.grandTotal)}</div>
                                </div>
                            </Section>

                            <Section title="Payment">
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                                    <div><strong>Method:</strong> {order.payment?.method ?? "-"}</div>
                                    <div><strong>Status:</strong> {order.payment?.status ?? "-"}</div>
                                    <div><strong>Transaction:</strong> {order.payment?.transactionId ?? "-"}</div>
                                </div>
                            </Section>

                            <Section title="Shipping">
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                                    <div>
                                        <div><strong>Method:</strong> {order.shipping?.method ?? "-"}</div>
                                        <div><strong>Status:</strong> {order.shipping?.status ?? "-"}</div>
                                        <div><strong>Tracking #:</strong> {order.shipping?.trackingNumber ?? "-"}</div>
                                    </div>
                                    <div>
                                        <div><strong>Address:</strong></div>
                                        <div>
                                            {[
                                                order.shipping?.address?.street,
                                                order.shipping?.address?.postalCode,
                                                order.shipping?.address?.city,
                                                order.shipping?.address?.country,
                                            ]
                                                .filter(Boolean)
                                                .join(", ") || "-"}
                                        </div>
                                    </div>
                                </div>
                            </Section>
                        </>
                    )}
                </div>

                <footer
                    style={{
                        padding: 12,
                        borderTop: "1px solid #eee",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            border: "1px solid #ddd",
                            background: "white",
                            borderRadius: 6,
                            padding: "8px 12px",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};