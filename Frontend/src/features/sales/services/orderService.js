// src/features/sales/services/orderService.js
import { salesApi } from './salesApi';

export const orderService = {
  getTeamOrders: async () => {
    const orders = await salesApi.orders();
    return orders.map((order) => ({ ...order, id: order.order_id, orderNo: order.order_no, seName: order.employee_name, value: Number(order.order_value), status: order.order_status, territory: order.territory_name || "Unassigned" }));
  },

  getTerritories: async () => {
    return salesApi.territories();
  },

  // ASM assigns territory to a particular SE
  assignTerritoryToSE: (seId, newTerritory) => {
    return salesApi.assignOrderTerritory(seId, newTerritory).then(async () => ({
      success: true,
      updatedOrders: await orderService.getTeamOrders(),
    }));
  }
};
