// src/features/sales/services/orderService.js
import { mockOrdersData, availableTerritories } from '../mock/mockOrders';

let localOrdersCache = [...mockOrdersData];

export const orderService = {
  getTeamOrders: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...localOrdersCache]);
      }, 200);
    });
  },

  getTerritories: () => {
    return new Promise((resolve) => {
      resolve([...availableTerritories]);
    });
  },

  // ASM assigns territory to a particular SE
  assignTerritoryToSE: (seId, newTerritory) => {
    return new Promise((resolve) => {
      localOrdersCache = localOrdersCache.map(order => 
        order.id === seId ? { ...order, territory: newTerritory } : order
      );
      setTimeout(() => {
        resolve({ success: true, updatedOrders: [...localOrdersCache] });
      }, 150);
    });
  }
};