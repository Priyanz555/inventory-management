"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft,
  Menu,
  MapPin,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Edit,
  FileDown,
  Truck,
  Eye,
  Plus,
  FileText,
  Package
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface OrderItem {
  id: string
  name: string
  image: string
  totalPrice: string
  quantity: number
  pricePerPiece: string
  articleId?: string
  eanCode?: string
  batchId?: string
  itemPrice?: number
  quantityCA?: number
  quantityEA?: number
  discount?: number
  itemTotal?: number
}

interface OrderDetails {
  id: string
  orderNumber: string
  retailerName: string
  retailerId: string
  fosName: string
  status: string
  orderDate: string
  deliveryAddress: string
  items: OrderItem[]
  totalMRP: string
  margin: string
  scheme: string
  totalBillingPrice: string
  totalAmount: string
  loadOutNumber?: string
  manufacturingDate?: string
  processingStatus?: string
  rejectionReason?: string
  returnReason?: string
  dispatchDate?: string
  invoiceNumber?: string
  deliveredAt?: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false)

  // Mock data generator for different order types
  const generateMockOrderDetails = (orderId: string): OrderDetails => {
    const orderVariations = {
      // Pending Order
      "RO-2024-001": {
        id: "RO-2024-001",
        orderNumber: "RC68C7FBB40EBEAD1B85",
        retailerName: "Internal Demo Campa GST @1",
        retailerId: "RP99000065",
        fosName: "Automation regular fos",
        status: "pending",
        orderDate: "15 Sept 2025, 05:12 pm",
        deliveryAddress: "Sarjapur - Marathahalli Road, BENGALURU, Karnataka, 560102",
        items: [
          {
            id: "1",
            name: "SUREWATER 250ML PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹360.00",
            quantity: 20,
            pricePerPiece: "₹18.00/pc"
          },
          {
            id: "2",
            name: "Campa Energy Berry Kick 150ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹90.00",
            quantity: 10,
            pricePerPiece: "₹9.00/pc"
          }
        ],
        totalMRP: "₹500",
        margin: "- ₹50",
        scheme: "- ₹0",
        totalBillingPrice: "450.00",
        totalAmount: "₹0"
      },
      // Accepted Order
      "RO-2024-002": {
        id: "RO-2024-002",
        orderNumber: "RC68C40B220E41840687",
        retailerName: "CDO APK @12",
        retailerId: "RP42400065",
        fosName: "CDO APK @12",
        status: "accepted",
        orderDate: "12 Sept 2025, 05:29 pm",
        deliveryAddress: "Whitefield Main Road, BENGALURU, Karnataka, 560066",
        items: [
          {
            id: "1",
            name: "Campa Cola 200ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹270.00",
            quantity: 20,
            pricePerPiece: "₹13.50/pc"
          }
        ],
        totalMRP: "₹300",
        margin: "- ₹20",
        scheme: "- ₹10",
        totalBillingPrice: "270.00",
        totalAmount: "₹270",
        loadOutNumber: "LO-2024-002",
        manufacturingDate: "10 Sept 2025",
        processingStatus: "accepted",
        dispatchDate: "13 Sept 2025, 10:30 am",
        invoiceNumber: "INV-2024-002"
      },
      // Rejected Order
      "RO-2024-003": {
        id: "RO-2024-003",
        orderNumber: "RC68C407730E9B765B0F",
        retailerName: "CDO NonGST REG @2",
        retailerId: "RP02500085",
        fosName: "CDO NonGST REG @2",
        status: "rejected",
        orderDate: "12 Sept 2025, 05:13 pm",
        deliveryAddress: "Electronic City Phase 1, BENGALURU, Karnataka, 560100",
        items: [
          {
            id: "1",
            name: "Campa Energy Berry Kick 150ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹180.00",
            quantity: 10,
            pricePerPiece: "₹18.00/pc"
          }
        ],
        totalMRP: "₹200",
        margin: "- ₹15",
        scheme: "- ₹5",
        totalBillingPrice: "180.00",
        totalAmount: "₹0",
        rejectionReason: "Out of Stock - Product unavailable in warehouse",
        processingStatus: "rejected"
      },
      // Dispatched Order
      "RO-2024-004": {
        id: "RO-2024-004",
        orderNumber: "RC68C407730E9B765B0F",
        retailerName: "Premium Store @5",
        retailerId: "RP12345678",
        fosName: "Premium Store @5",
        status: "dispatched",
        orderDate: "10 Sept 2025, 02:15 pm",
        deliveryAddress: "MG Road, BENGALURU, Karnataka, 560001",
        items: [
          {
            id: "1",
            name: "Campa Cola 500ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹450.00",
            quantity: 15,
            pricePerPiece: "₹30.00/pc"
          },
          {
            id: "2",
            name: "Campa Energy Berry Kick 250ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹300.00",
            quantity: 12,
            pricePerPiece: "₹25.00/pc"
          }
        ],
        totalMRP: "₹800",
        margin: "- ₹40",
        scheme: "- ₹10",
        totalBillingPrice: "750.00",
        totalAmount: "₹750",
        loadOutNumber: "LO-2024-004",
        manufacturingDate: "08 Sept 2025",
        processingStatus: "dispatched",
        dispatchDate: "11 Sept 2025, 09:45 am",
        invoiceNumber: "INV-2024-004"
      },
      // Returned Order
      "RO-2024-005": {
        id: "RO-2024-005",
        orderNumber: "RC68C9999999999999999",
        retailerName: "City Mart @8",
        retailerId: "RP87654321",
        fosName: "City Mart @8",
        status: "returned",
        orderDate: "08 Sept 2025, 11:30 am",
        deliveryAddress: "Koramangala, BENGALURU, Karnataka, 560034",
        items: [
          {
            id: "1",
            name: "Campa Cola 200ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹200.00",
            quantity: 10,
            pricePerPiece: "₹20.00/pc"
          }
        ],
        totalMRP: "₹220",
        margin: "- ₹15",
        scheme: "- ₹5",
        totalBillingPrice: "200.00",
        totalAmount: "₹0",
        returnReason: "Quality Issue - Damaged packaging",
        processingStatus: "returned"
      },
      // Partially Returned Order
      "RO-2024-006": {
        id: "RO-2024-006",
        orderNumber: "RC68C8888888888888888",
        retailerName: "Express Store @15",
        retailerId: "RP11111111",
        fosName: "Express Store @15",
        status: "partially_returned",
        orderDate: "07 Sept 2025, 03:45 pm",
        deliveryAddress: "Indiranagar, BENGALURU, Karnataka, 560038",
        items: [
          {
            id: "1",
            name: "Campa Cola 200ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹150.00",
            quantity: 8,
            pricePerPiece: "₹18.75/pc"
          },
          {
            id: "2",
            name: "Campa Energy Berry Kick 150ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹90.00",
            quantity: 5,
            pricePerPiece: "₹18.00/pc"
          }
        ],
        totalMRP: "₹280",
        margin: "- ₹25",
        scheme: "- ₹15",
        totalBillingPrice: "240.00",
        totalAmount: "₹240",
        returnReason: "Partial return - 2 units damaged",
        processingStatus: "partially_returned"
      },
      // Offline Order 1
      "RO-2024-007": {
        id: "RO-2024-007",
        orderNumber: "RC68C7777777777777777",
        retailerName: "Walk-in Customer @30",
        retailerId: "RP33333333",
        fosName: "Walk-in Customer @30",
        status: "offline",
        orderDate: "06 Sept 2025, 02:30 pm",
        deliveryAddress: "Direct Sale - No Delivery Address",
        items: [
          {
            id: "1",
            name: "Campa Cola 500ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹200.00",
            quantity: 5,
            pricePerPiece: "₹40.00/pc",
            articleId: "6278JHKWH",
            eanCode: "6278JHKWH",
            batchId: "6278JHKWHHWN",
            itemPrice: 40.00,
            quantityCA: 5,
            quantityEA: 0,
            discount: 0,
            itemTotal: 200.00
          },
          {
            id: "2",
            name: "Campa Energy Berry Kick 250ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹120.00",
            quantity: 3,
            pricePerPiece: "₹40.00/pc",
            articleId: "6278JHKWH",
            eanCode: "6278JHKWH",
            batchId: "6278JHKWHHWN",
            itemPrice: 40.00,
            quantityCA: 3,
            quantityEA: 0,
            discount: 0,
            itemTotal: 120.00
          }
        ],
        totalMRP: "₹350",
        margin: "- ₹20",
        scheme: "- ₹10",
        totalBillingPrice: "320.00",
        totalAmount: "₹320",
        processingStatus: "billed",
        invoiceNumber: "INV-OFF-007"
      },
      // Offline Order 2
      "RO-2024-008": {
        id: "RO-2024-008",
        orderNumber: "RC68C6666666666666666",
        retailerName: "Direct Sale @35",
        retailerId: "RP44444444",
        fosName: "Direct Sale @35",
        status: "offline",
        orderDate: "05 Sept 2025, 11:15 am",
        deliveryAddress: "Direct Sale - No Delivery Address",
        items: [
          {
            id: "1",
            name: "Campa Cola 200ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹180.00",
            quantity: 6,
            pricePerPiece: "₹30.00/pc",
            articleId: "6278JHKWH",
            eanCode: "6278JHKWH",
            batchId: "6278JHKWHHWN",
            itemPrice: 30.00,
            quantityCA: 6,
            quantityEA: 0,
            discount: 0,
            itemTotal: 180.00
          }
        ],
        totalMRP: "₹200",
        margin: "- ₹15",
        scheme: "- ₹5",
        totalBillingPrice: "180.00",
        totalAmount: "₹180",
        processingStatus: "billed",
        invoiceNumber: "INV-OFF-008"
      },
      // Delivered Order
      "RO-2024-009": {
        id: "RO-2024-009",
        orderNumber: "RC68C9999999999999998",
        retailerName: "Delivery Test Store @40",
        retailerId: "RP55555555",
        fosName: "Delivery Test @40",
        status: "delivered",
        orderDate: "04 Sept 2025, 09:30 am",
        deliveryAddress: "Commercial Street, BENGALURU, Karnataka, 560008",
        items: [
          {
            id: "1",
            name: "Campa Cola 500ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹300.00",
            quantity: 10,
            pricePerPiece: "₹30.00/pc"
          },
          {
            id: "2",
            name: "Campa Energy Berry Kick 250ml PET",
            image: "/api/placeholder/80/80",
            totalPrice: "₹150.00",
            quantity: 5,
            pricePerPiece: "₹30.00/pc"
          }
        ],
        totalMRP: "₹500",
        margin: "- ₹50",
        scheme: "- ₹70",
        totalBillingPrice: "380.00",
        totalAmount: "₹380",
        loadOutNumber: "LO-2024-009",
        manufacturingDate: "02 Sept 2025",
        processingStatus: "delivered",
        dispatchDate: "04 Sept 2025, 11:00 am",
        deliveredAt: "2025-09-04T14:30:00Z",
        invoiceNumber: "INV-2024-009"
      }
    }

    return orderVariations[orderId as keyof typeof orderVariations] || orderVariations["RO-2024-001"]
  }

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrderDetails = async () => {
      setLoading(true)
      
      const mockOrderDetails = generateMockOrderDetails(params.orderId as string)
      
      setOrderDetails(mockOrderDetails)
      setLoading(false)
    }

    fetchOrderDetails()
  }, [params.orderId])

  const handleAccept = () => {
    console.log("Accepting order:", orderDetails?.id)
    // Implement accept logic
  }

  const handleModify = () => {
    console.log("Modifying order:", orderDetails?.id)
    // Implement modify logic
  }

  const handleReject = () => {
    console.log("Rejecting order:", orderDetails?.id)
    // Implement reject logic
  }

  const handleMarkAsDelivered = async () => {
    if (!orderDetails) return;
    
    setIsMarkingDelivered(true);
    
    try {
      const response = await fetch(`/api/orders/retailer/${orderDetails.id}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveredBy: 'Current User', // In real app, get from auth context
          deliveryNotes: 'Order delivered successfully'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update the order details with delivered status
        setOrderDetails(prev => prev ? {
          ...prev,
          status: 'delivered',
          processingStatus: 'delivered',
          deliveredAt: new Date().toISOString()
        } : null);
        
        console.log('Order marked as delivered:', result);
      } else {
        console.error('Failed to mark order as delivered');
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    } finally {
      setIsMarkingDelivered(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link href="/orders/retailer">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Order Information Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/orders/retailer">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{orderDetails.retailerName}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              orderDetails.status === 'pending' ? 'bg-orange-100 text-orange-800' :
              orderDetails.status === 'accepted' ? 'bg-green-100 text-green-800' :
              orderDetails.status === 'rejected' ? 'bg-red-100 text-red-800' :
              orderDetails.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
              orderDetails.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
              orderDetails.status === 'returned' ? 'bg-yellow-100 text-yellow-800' :
              orderDetails.status === 'partially_returned' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1).replace('_', ' ')}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>Order placed on {orderDetails.orderDate}</p>
            <p>Retailer#{orderDetails.retailerId}</p>
            <p>Order#{orderDetails.orderNumber}</p>
            <p>FOS#{orderDetails.fosName}</p>
            <p>Delivery Address: {orderDetails.deliveryAddress}</p>
            
            {/* Additional status-specific information */}
            {orderDetails.dispatchDate && (
              <p className="text-green-600 font-medium">Dispatched on: {orderDetails.dispatchDate}</p>
            )}
            {orderDetails.deliveredAt && (
              <p className="text-emerald-600 font-medium">Delivered on: {new Date(orderDetails.deliveredAt).toLocaleString()}</p>
            )}
            {orderDetails.rejectionReason && (
              <p className="text-red-600 font-medium">Rejection Reason: {orderDetails.rejectionReason}</p>
            )}
            {orderDetails.returnReason && (
              <p className="text-yellow-600 font-medium">Return Reason: {orderDetails.returnReason}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Item details {orderDetails.items.length} Items • {orderDetails.items.reduce((sum, item) => sum + item.quantity, 0)} Qty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Qty: {item.quantity}</p>
                        <p>{item.pricePerPiece}</p>
                        {/* Show additional offline order details */}
                        {orderDetails.status === 'offline' && item.articleId && (
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Article ID: {item.articleId}</p>
                            <p>EAN: {item.eanCode}</p>
                            <p>Batch: {item.batchId}</p>
                            {item.quantityCA && item.quantityCA > 0 && <p>Qty (CA): {item.quantityCA}</p>}
                            {item.quantityEA && item.quantityEA > 0 && <p>Qty (EA): {item.quantityEA}</p>}
                            {item.discount && item.discount > 0 && <p>Discount: ₹{item.discount}</p>}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{item.totalPrice}</p>
                        {orderDetails.status === 'offline' && item.itemTotal && (
                          <p className="text-xs text-gray-500">Total: ₹{item.itemTotal}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing and Payment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pricing & Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Pricing Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="font-medium">{orderDetails.totalMRP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Margin</span>
                    <span className="text-green-600 font-medium">{orderDetails.margin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheme</span>
                    <span className="text-green-600 font-medium">{orderDetails.scheme}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-gray-900">Total Billing Price</span>
                    <span className="font-bold text-lg">₹{orderDetails.totalBillingPrice}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="upi" className="rounded" />
                    <label htmlFor="upi" className="text-sm">UPI</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="cash" className="rounded" />
                    <label htmlFor="cash" className="text-sm">Cash</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="credit" className="rounded" />
                    <label htmlFor="credit" className="text-sm">Credit</label>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-gray-900">Total Amount</span>
                    <span className="font-bold text-lg">{orderDetails.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                {orderDetails.status === 'pending' && (
                  <>
                    <Button 
                      onClick={handleAccept}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      onClick={handleModify}
                      variant="outline" 
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modify
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="outline" 
                      className="w-full border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                
                {orderDetails.status === 'accepted' && (
                  <>
                    <Button 
                      onClick={() => console.log("Dispatch Order")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Dispatch Order
                    </Button>
                  </>
                )}
                
                {orderDetails.status === 'dispatched' && (
                  <>
                    <Button 
                      onClick={handleMarkAsDelivered}
                      disabled={isMarkingDelivered}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {isMarkingDelivered ? 'Marking as Delivered...' : 'Mark as Delivered'}
                    </Button>
                  </>
                )}
                
                {orderDetails.status === 'delivered' && (
                  <>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-emerald-800 font-medium">Order Delivered</p>
                      <p className="text-emerald-600 text-sm">Successfully completed delivery</p>
                    </div>
                  </>
                )}
                
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}