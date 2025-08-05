"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ShoppingCart,
  FileText,
  Users,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage and track all your primary and retailer (Secondary) orders.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Primary Orders</p>
                <p className="text-2xl font-bold text-green-600">342</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retailer Orders</p>
                <p className="text-2xl font-bold text-orange-600">905</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active FOS</p>
                <p className="text-2xl font-bold text-purple-600">28</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Types Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Orders Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/orders/primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Primary Orders</h3>
                    <p className="text-gray-600">Manage supplier and wholesale orders</p>
                    <div className="mt-2 text-sm text-gray-500">
                      • Create GRN<br/>
                      • Track delivery status<br/>
                      • View order details
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Retailer Orders Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/orders/retailer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Retailer Orders</h3>
                    <p className="text-gray-600">Manage retail and field operations orders</p>
                    <div className="mt-2 text-sm text-gray-500">
                      • Bulk download orders<br/>
                      • Create offline orders<br/>
                      • Track FOS activities
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
} 