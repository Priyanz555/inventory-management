'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UnprocessedOrder {
  id: string;
  orderNo: string;
  retailer: string;
  date: string;
  totalSKUs: number;
  cases: number;
  status: string;
}

export default function UnprocessedOrdersPage() {
  const [orders, setOrders] = useState<UnprocessedOrder[]>([]);
  const [filters, setFilters] = useState({
    orderNo: '',
    retailer: '',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnprocessedOrder | null>(null);
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  useEffect(() => {
    fetchUnprocessedOrders();
  }, [filters]);

  const fetchUnprocessedOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        orderNo: filters.orderNo,
        retailer: filters.retailer,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      const response = await fetch(`/api/orders/unprocessed?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching unprocessed orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const dispatchFull = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/dispatch/full`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchUnprocessedOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error dispatching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const dispatchPartial = async (orderId: string, quantities: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/dispatch/partial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quantities),
      });

      if (response.ok) {
        setShowPartialModal(false);
        fetchUnprocessedOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error dispatching partial order:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeOrder = async (orderId: string, remarks: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks }),
      });

      if (response.ok) {
        setShowCloseModal(false);
        fetchUnprocessedOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Error closing order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manual Handling of Unprocessed Orders</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="orderNo">Order No</Label>
              <Input
                id="orderNo"
                value={filters.orderNo}
                onChange={(e) => setFilters(prev => ({ ...prev, orderNo: e.target.value }))}
                placeholder="Search order number"
              />
            </div>
            <div>
              <Label htmlFor="retailer">Retailer Name</Label>
              <Input
                id="retailer"
                value={filters.retailer}
                onChange={(e) => setFilters(prev => ({ ...prev, retailer: e.target.value }))}
                placeholder="Search retailer"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unprocessed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading unprocessed orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Order No</th>
                    <th className="border p-2 text-left">Retailer</th>
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Total SKUs</th>
                    <th className="border p-2 text-left">Cases</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="border p-2">
                        <button 
                          className="text-blue-600 hover:underline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          {order.orderNo}
                        </button>
                      </td>
                      <td className="border p-2">{order.retailer}</td>
                      <td className="border p-2">{order.date}</td>
                      <td className="border p-2">{order.totalSKUs}</td>
                      <td className="border p-2">{order.cases}</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="border p-2">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => dispatchFull(order.id)}
                            size="sm"
                            variant="outline"
                            disabled={loading}
                          >
                            Dispatch Full
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowPartialModal(true);
                            }}
                            size="sm"
                            variant="outline"
                            disabled={loading}
                          >
                            Dispatch Partial
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCloseModal(true);
                            }}
                            size="sm"
                            variant="outline"
                            disabled={loading}
                          >
                            Close
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="border p-4 text-center text-gray-500">
                        No unprocessed orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partial Dispatch Modal */}
      {showPartialModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Partial Dispatch - {selectedOrder.orderNo}</h3>
            <div className="mb-4">
              <Label>Dispatch Quantities</Label>
              <p className="text-sm text-gray-600 mb-2">
                Enter quantities to dispatch for each SKU
              </p>
              {/* In real implementation, show line items with editable quantities */}
            </div>
            <div className="mb-4">
              <Label>Expected Next Dispatch Date</Label>
              <Input type="date" className="mt-1" />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => setShowPartialModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => dispatchPartial(selectedOrder.id, {})}
                disabled={loading}
              >
                Confirm Partial Dispatch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Order Modal */}
      {showCloseModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Close Order - {selectedOrder.orderNo}</h3>
            <div className="mb-4">
              <Label>Mandatory Remarks</Label>
              <textarea 
                className="w-full p-2 border rounded mt-1"
                rows={4}
                placeholder="Enter reason for closing this order..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => setShowCloseModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => closeOrder(selectedOrder.id, '')}
                disabled={loading}
              >
                Confirm Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 