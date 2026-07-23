// src/features/sales/components/SEMyOrdersTable.jsx
import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  ChevronDown, 
  Search, 
  X, 
  Building2, 
  User, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  XCircle 
} from 'lucide-react';

const SEMyOrdersTable = ({ orders: initialOrders = [] }) => {
  // Sample Data with B2B / B2C distinction
  const defaultOrders = [
    { id: 'ORD-1052', customer: 'ABC Distributors', type: 'B2B', value: 125000, status: 'Confirmed', date: '18 May 2026', items: 12, paymentStatus: 'Paid', address: 'Mumbai, MH' },
    { id: 'ORD-1051', customer: 'PQR Traders', type: 'B2B', value: 95000, status: 'Packed', date: '18 May 2026', items: 8, paymentStatus: 'Pending', address: 'Delhi, DL' },
    { id: 'ORD-1050', customer: 'Rahul Sharma', type: 'B2C', value: 4500, status: 'Delivered', date: '17 May 2026', items: 2, paymentStatus: 'Paid', address: 'Jaipur, RJ' },
    { id: 'ORD-1049', customer: 'XYZ Retailers', type: 'B2B', value: 60000, status: 'Confirmed', date: '17 May 2026', items: 4, paymentStatus: 'Paid', address: 'Ahemdabad, GJ' },
    { id: 'ORD-1048', customer: 'Ananya Verma', type: 'B2C', value: 2800, status: 'Pending', date: '16 May 2026', items: 1, paymentStatus: 'Pending', address: 'Chandigarh, PB' },
    { id: 'ORD-1047', customer: 'Super Market', type: 'B2B', value: 55000, status: 'Pending', date: '16 May 2026', items: 6, paymentStatus: 'Pending', address: 'Chandigarh, PB' },
  ];

  const [ordersList, setOrdersList] = useState(initialOrders.length > 0 ? initialOrders : defaultOrders);
  
  // Tab State: 'B2B' | 'B2C'
  const [activeTab, setActiveTab] = useState('B2B');

  // Modals & View States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isFullDirectoryOpen, setIsFullDirectoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Badge Style Mapper based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return { style: 'bg-[#0f2417] text-green-400 border-green-800/40', icon: <CheckCircle2 size={12} /> };
      case 'Packed':
        return { style: 'bg-[#291f0e] text-[#FFC107] border-[#4a3717]', icon: <Package size={12} /> };
      case 'Delivered':
        return { style: 'bg-[#0e221d] text-emerald-400 border-emerald-800/40', icon: <Truck size={12} /> };
      case 'Pending':
        return { style: 'bg-[#2a130f] text-orange-400 border-orange-800/40', icon: <Clock size={12} /> };
      case 'Cancelled':
        return { style: 'bg-[#281116] text-red-400 border-red-800/40', icon: <XCircle size={12} /> };
      default:
        return { style: 'bg-zinc-800 text-gray-300 border-zinc-700', icon: <Clock size={12} /> };
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrdersList(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filter orders by active tab (B2B or B2C)
  const currentTabOrders = ordersList.filter(o => o.type === activeTab);

  // Filtered Orders for Directory Modal
  const filteredDirectoryOrders = ordersList.filter(o => {
    const matchesTab = o.type === activeTab;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-[#0c0b09] border border-[#1d170e] rounded-2xl p-5 shadow-xl flex flex-col justify-between relative">
      
      {/* 1. Header Section with B2B / B2C Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f1b14] pb-3 mb-3">
        <h3 className="text-white text-base font-bold tracking-wide flex items-center gap-2">
          <ShoppingBag size={18} className="text-[#FFC107]" />
          My Orders
        </h3>

        {/* B2B / B2C Toggle Tabs */}
        <div className="flex bg-[#141311] p-1 rounded-xl border border-[#282218] w-fit">
          <button
            onClick={() => setActiveTab('B2B')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'B2B' 
                ? 'bg-[#FFC107] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 size={13} />
            B2B
          </button>
          <button
            onClick={() => setActiveTab('B2C')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'B2C' 
                ? 'bg-[#FFC107] text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User size={13} />
            B2C
          </button>
        </div>
      </div>

      {/* 2. Main Orders Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#1f1a12] bg-[#0a0907]">
        <table className="w-full text-left text-xs min-w-[600px]">
          <thead>
            <tr className="bg-[#12100d] text-gray-400 font-semibold tracking-wider border-b border-[#1f1a12] text-[11px]">
              <th className="py-3 px-4 font-medium">Order No.</th>
              <th className="py-3 px-4 font-medium">Customer</th>
              <th className="py-3 px-4 font-medium">Value (₹)</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-right">Order Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1812]">
            {currentTabOrders.slice(0, 5).map((order) => {
              const statusInfo = getStatusBadge(order.status);
              return (
                <tr 
                  key={order.id} 
                  className="hover:bg-[#17140e]/80 transition-colors cursor-pointer group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="py-3.5 px-4 font-bold text-gray-200 group-hover:text-[#FFC107] transition-colors font-mono">
                    {order.id}
                  </td>
                  
                  <td className="py-3.5 px-4 text-gray-300 font-medium">
                    {order.customer}
                  </td>
                  
                  <td className="py-3.5 px-4 text-gray-200 font-mono font-bold">
                    {order.value.toLocaleString('en-IN')}
                  </td>
                  
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`appearance-none text-[11px] font-bold px-3 py-1 pr-7 rounded-lg border cursor-pointer focus:outline-none transition-all flex items-center gap-1.5 ${statusInfo.style}`}
                      >
                        <option value="Confirmed" className="bg-[#0c0b09] text-green-400">Confirmed</option>
                        <option value="Packed" className="bg-[#0c0b09] text-[#FFC107]">Packed</option>
                        <option value="Delivered" className="bg-[#0c0b09] text-emerald-400">Delivered</option>
                        <option value="Pending" className="bg-[#0c0b09] text-orange-400">Pending</option>
                        <option value="Cancelled" className="bg-[#0c0b09] text-red-400">Cancelled</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-2 pointer-events-none text-gray-400" />
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right text-gray-400 font-mono text-[11px]">
                    {order.date}
                  </td>
                </tr>
              );
            })}

            {currentTabOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                  No {activeTab} orders available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Bottom Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#1a1712]">
        <button 
          onClick={() => setIsFullDirectoryOpen(true)}
          className="text-xs text-[#FFC107] font-bold hover:underline flex items-center gap-1.5 cursor-pointer transition-all hover:gap-2 group active:scale-95"
        >
          <span>View All Orders</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* --- MODAL 1: ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#241f17] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#FFC107] font-bold uppercase tracking-wider">
                  {selectedOrder.type} Order Details
                </span>
                <h4 className="text-white text-lg font-bold font-mono">{selectedOrder.id}</h4>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-white bg-[#1a1813] hover:bg-[#28241d] rounded-xl cursor-pointer transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13] flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1.5">
                  {selectedOrder.type === 'B2B' ? <Building2 size={14} /> : <User size={14} />} Customer:
                </span>
                <span className="text-white font-bold">{selectedOrder.customer}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13]">
                  <span className="text-gray-400 block mb-1">Total Value</span>
                  <span className="text-[#FFC107] font-mono font-bold text-sm">₹{selectedOrder.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13]">
                  <span className="text-gray-400 block mb-1">Payment</span>
                  <span className={`font-bold font-mono ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-400' : 'text-orange-400'}`}>
                    {selectedOrder.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="bg-[#0a0907] p-3 rounded-xl border border-[#231d13] space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Order Date:</span>
                  <span className="text-gray-200 font-mono">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Items Count:</span>
                  <span className="text-gray-200 font-mono">{selectedOrder.items || 1} SKUs</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Address:</span>
                  <span className="text-gray-200 font-medium">{selectedOrder.address || 'Standard Location'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-[#FFC107] text-black font-bold rounded-xl text-xs hover:bg-[#e0a800] transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: FULL ORDERS DIRECTORY MODAL --- */}
      {isFullDirectoryOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#12110e] border border-[#382b17] rounded-2xl w-full max-w-4xl max-h-[85vh] p-6 shadow-2xl flex flex-col justify-between">
            
            <div>
              <div className="flex justify-between items-center border-b border-[#241f17] pb-4">
                <div>
                  <h3 className="text-white text-base font-bold flex items-center gap-2">
                    <ShoppingBag size={20} className="text-[#FFC107]" />
                    All {activeTab} Orders Directory
                  </h3>
                  <p className="text-xs text-gray-400">Total {activeTab} Orders: {currentTabOrders.length}</p>
                </div>
                <button 
                  onClick={() => setIsFullDirectoryOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white bg-[#1a1813] hover:bg-[#28241d] rounded-xl cursor-pointer transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filters & Search Row */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by Order No or Customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0a0907] border border-[#2b2214] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFC107]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0a0907] border border-[#2b2214] text-xs text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FFC107] cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Packed">Packed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Directory Table */}
            <div className="overflow-y-auto my-4 rounded-xl border border-[#1f1a12] max-h-[48vh] pr-1">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#17140e] text-gray-400 border-b border-[#292116] z-10">
                  <tr>
                    <th className="py-2.5 px-4">Order No</th>
                    <th className="py-2.5 px-4">Customer Name</th>
                    <th className="py-2.5 px-4">Value (₹)</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Order Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1812]">
                  {filteredDirectoryOrders.map((order) => {
                    const statusInfo = getStatusBadge(order.status);
                    return (
                      <tr key={order.id} className="hover:bg-[#1a1711] transition-colors">
                        <td className="py-2.5 px-4 text-white font-mono font-bold">{order.id}</td>
                        <td className="py-2.5 px-4 text-gray-300">{order.customer}</td>
                        <td className="py-2.5 px-4 font-mono text-[#FFC107] font-bold">₹{order.value.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${statusInfo.style}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-gray-400 font-mono text-[11px]">{order.date}</td>
                      </tr>
                    );
                  })}

                  {filteredDirectoryOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                        No orders match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#241f17]">
              <button
                onClick={() => setIsFullDirectoryOpen(false)}
                className="px-4 py-2 bg-[#FFC107] text-black font-bold rounded-xl text-xs cursor-pointer hover:bg-[#e0a800] transition-colors"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SEMyOrdersTable;