'use client';

import { OrderService } from "@/features/orders/application/services/OrderService";
import { OrderRepository } from "@/features/orders/infrastructure/repositories/OrderRepository";
import { OrderDialog } from "@/features/orders/presentations/components/OrderDialog";
import { OrderServiceProvider } from "@/features/orders/presentations/providers/OrderServiceProvider";
import { OrderApi } from '@/features/orders/infrastructure/api/OrderApi';

export default function OrderPage() {
  return (
    <div>
      <h1>Order Page</h1>
      <OrderServiceProvider service={new OrderService(new OrderRepository(new OrderApi()))}>
        <OrderDialog
          open={true}
          orderId={"123"}
          onClose={() => {}} />
      </OrderServiceProvider>
    </div>
  );
}