'use client';

import { OrderDialog } from "@/features/orders/presentations/components/OrderDialog";
import { OrdersRootProvider } from "@/features/orders/presentations/providers/OrdersRootProvider";

export default function OrderPage() {
  return (
    <div>
      <h1>Order Page</h1>
      <OrdersRootProvider>
        <OrderDialog
          open={true}
          orderId={"123"}
          onClose={() => {}} />
      </OrdersRootProvider>
    </div>
  );
}