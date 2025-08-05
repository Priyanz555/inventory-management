"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft,
  Calendar,
  Plus,
  Save,
  Trash2
} from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  articleId: string
  itemName: string
  eanCode: string
  batchId: string
  itemPrice: number
  quantityCA: number
  quantityEA: number
  discount: number
  itemTotal: number
}

interface OfflineOrder {
  retailerName: string
  orderId: string
  invoiceId: string
  orderDate: string
  items: OrderItem[]
}

export default function OfflineOrderPage() {
  const [order, setOrder] = useState<OfflineOrder>({
    retailerName: "",
    orderId: "",
    invoiceId: "",
    orderDate: "",
    items: []
  })

  const addItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      articleId: "",
      itemName: "",
      eanCode: "",
      batchId: "",
      itemPrice: 0,
      quantityCA: 0,
      quantityEA: 0,
      discount: 0,
      itemTotal: 0
    }
    setOrder(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          
          // Auto-calculate item total
          if (field === 'itemPrice' || field === 'quantityCA' || field === 'quantityEA' || field === 'discount') {
            const totalQuantity = updatedItem.quantityCA + (updatedItem.quantityEA / 24) // Convert EA to cases
            const subtotal = totalQuantity * updatedItem.itemPrice
            updatedItem.itemTotal = subtotal - updatedItem.discount
          }
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const removeItem = (id: string) => {
    setOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const saveItem = (id: string) => {
    // In a real app, this would save the item to the backend
    console.log("Saving item:", id)
  }

  const createOrder = async () => {
    // In a real app, this would submit the order to the backend
    console.log("Creating order:", order)
  }

  const cancelOrder = () => {
    // Reset form or navigate back
    setOrder({
      retailerName: "",
      orderId: "",
      invoiceId: "",
      orderDate: "",
      items: []
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Offline Orders</h1>
          <p className="text-gray-600">Create orders for walk-in sales to retailers</p>
        </div>
        <Link href="/orders/retailer">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Retailer Orders
          </Button>
        </Link>
      </div>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="retailerName">Retailer Name</Label>
              <Input
                id="retailerName"
                placeholder="Retailer Name"
                value={order.retailerName}
                onChange={(e) => setOrder(prev => ({ ...prev, retailerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Order ID"
                value={order.orderId}
                onChange={(e) => setOrder(prev => ({ ...prev, orderId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="invoiceId">Invoice ID</Label>
              <Input
                id="invoiceId"
                placeholder="Invoice ID"
                value={order.invoiceId}
                onChange={(e) => setOrder(prev => ({ ...prev, invoiceId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="orderDate">Order date</Label>
              <div className="relative">
                <Input
                  id="orderDate"
                  type="date"
                  placeholder="DD/MM/YYYY"
                  value={order.orderDate}
                  onChange={(e) => setOrder(prev => ({ ...prev, orderDate: e.target.value }))}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Details Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Item Details</CardTitle>
            <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Article ID</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Item name</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">EAN Code</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Batch ID</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Item Price</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Qty (CA)</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Qty (EA)</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Discount</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Item Total</th>
                  <th className="border border-blue-700 px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.items.length === 0 ? (
                                     <tr>
                     <td colSpan={10} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                       No items added yet. Click "Add Item" to start.
                     </td>
                   </tr>
                ) : (
                  order.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        <Input
                          placeholder="6278JHKWH"
                          value={item.articleId}
                          onChange={(e) => updateItem(item.id, 'articleId', e.target.value)}
                          className="border-0 p-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Input
                          placeholder="Item Name"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                          className="border-0 p-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Input
                          placeholder="6278JHKWH"
                          value={item.eanCode}
                          onChange={(e) => updateItem(item.id, 'eanCode', e.target.value)}
                          className="border-0 p-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Input
                          placeholder="6278JHKWHHWN"
                          value={item.batchId}
                          onChange={(e) => updateItem(item.id, 'batchId', e.target.value)}
                          className="border-0 p-0 focus:ring-0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Input
                          type="number"
                          placeholder="₹ 0"
                          value={item.itemPrice}
                          onChange={(e) => updateItem(item.id, 'itemPrice', parseFloat(e.target.value) || 0)}
                          className="border-0 p-0 focus:ring-0"
                        />
                      </td>
                                             <td className="border border-gray-300 px-4 py-2">
                         <Input
                           type="number"
                           placeholder="0"
                           value={item.quantityCA}
                           onChange={(e) => updateItem(item.id, 'quantityCA', parseInt(e.target.value) || 0)}
                           className="border-0 p-0 focus:ring-0"
                         />
                       </td>
                       <td className="border border-gray-300 px-4 py-2">
                         <Input
                           type="number"
                           placeholder="0"
                           value={item.quantityEA}
                           onChange={(e) => updateItem(item.id, 'quantityEA', parseInt(e.target.value) || 0)}
                           className="border-0 p-0 focus:ring-0"
                         />
                       </td>
                       <td className="border border-gray-300 px-4 py-2">
                         <Input
                           type="number"
                           placeholder="₹ 0"
                           value={item.discount}
                           onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                           className="border-0 p-0 focus:ring-0"
                         />
                       </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className="text-gray-900">₹ {item.itemTotal.toLocaleString()}</span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => saveItem(item.id)}
                            size="sm"
                            variant="outline"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => removeItem(item.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={cancelOrder}
          variant="outline"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Cancel
        </Button>
        <Button
          onClick={createOrder}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Order
        </Button>
      </div>
    </div>
  )
} 