// src/features/sales/hooks/useTeamOrders.js
import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

export const useTeamOrders = () => {
  const [orders, setOrders] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const ordersData = await orderService.getTeamOrders();
      const territoriesData = await orderService.getTerritories();
      setOrders(ordersData);
      setTerritories(territoriesData);
    } catch (err) {
      setError('Failed to fetch data updates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const allocateTerritory = async (seId, territoryName) => {
    try {
      const response = await orderService.assignTerritoryToSE(seId, territoryName);
      if (response.success) {
        setOrders(response.updatedOrders);
      }
    } catch (err) {
      console.error("Allocation failed", err);
    }
  };

  return { orders, territories, isLoading, error, allocateTerritory };
};