"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  Menu,
  X,
  MapPin,
  ChevronDown,
  ShoppingCart,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Truck,
  Wrench,
  ArrowRight,
  Warehouse,
  Package2
} from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

// Main navigation based on the image
const mainNavigation = [
  { name: "My Orders", href: "/orders/primary", icon: Package },
  { name: "Retailer Orders", href: "/orders/retailer", icon: ShoppingCart },
  { name: "Ready Stock", href: "/orders/ready-stock", icon: Truck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Claims", href: "/claims", icon: Wrench },
]

// Inventory management section
const inventoryNavigation = [
  { name: "Inventory Dashboard", href: "/inventory/dashboard", icon: BarChart3 },
  { name: "Inventory List", href: "/inventory", icon: Warehouse },
  { name: "Opening Stock", href: "/opening-stock/upload", icon: Package2 },
  { name: "Cycle Count", href: "/cycle-count/upload", icon: ClipboardCheck },
]

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: Settings },
]

const accountNavigation = [
  { name: "My Account", href: "/account", icon: User },
  { name: "Help", href: "/help", icon: HelpCircle },
  { name: "Log Out", href: "/logout", icon: LogOut },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Layout component for the inventory management system
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col jiomart-sidebar">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 jiomart-header">
            <h1 className="text-xl font-bold text-white">InvMgmt Digital</h1>
            <Button
              variant="jiomartHeader"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {/* Main Navigation Section */}
            {mainNavigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-colors"
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </a>
              )
            })}
            
            {/* Inventory Management Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Management</h3>
              <div className="mt-2 space-y-1">
                {inventoryNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
            
            {/* Account section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
              <div className="mt-2 space-y-1">
                {accountNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                      <ArrowRight className="ml-auto h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className={`pt-4 mt-4 border-t border-gray-200 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
              {!sidebarCollapsed && (
                <div className="text-xs text-gray-500 text-center">
                  Privacy Policy | Terms & Conditions
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-200 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className="flex flex-col flex-grow jiomart-sidebar border-r border-gray-200 relative z-30">
          <div className="flex flex-col items-center h-16 px-4 border-b border-gray-200 jiomart-header justify-center">
            <Button
              variant="jiomartHeader"
              size="icon"
              className="sidebar-toggle-btn rounded-full border border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <nav className={`flex-1 space-y-1 py-4 overflow-y-auto ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
            {/* Main Navigation Section */}
            {mainNavigation.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-2'} py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-all`}
                  style={sidebarCollapsed ? { width: '100%' } : {}}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between w-full ml-3">
                      <span className="truncate">{item.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </a>
              )
            })}
            
            {/* Inventory Management Section */}
            <div className={`pt-4 mt-4 border-t border-gray-200 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
              {!sidebarCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Management</h3>}
              <div className="mt-2 space-y-1">
                {inventoryNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-2'} py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-all`}
                      style={sidebarCollapsed ? { width: '100%' } : {}}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <div className="flex items-center justify-between w-full ml-3">
                          <span className="truncate">{item.name}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
            
            {/* Admin section */}
            <div className={`pt-4 mt-4 border-t border-gray-200 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
              {!sidebarCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</h3>}
              <div className="mt-2 space-y-1">
                {adminNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-2'} py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-all`}
                      style={sidebarCollapsed ? { width: '100%' } : {}}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <div className="flex items-center justify-between w-full ml-3">
                          <span className="truncate">{item.name}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
            
            {/* Account section */}
            <div className={`pt-4 mt-4 border-t border-gray-200 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
              {!sidebarCollapsed && <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>}
              <div className="mt-2 space-y-1">
                {accountNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'px-2'} py-2 text-sm font-medium rounded-md jiomart-nav-item hover:bg-gray-50 transition-all`}
                      style={sidebarCollapsed ? { width: '100%' } : {}}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <div className="flex items-center justify-between w-full ml-3">
                          <span className="truncate">{item.name}</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className={`pt-4 mt-4 border-t border-gray-200 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
              {!sidebarCollapsed && (
                <div className="text-xs text-gray-500 text-center">
                  Privacy Policy | Terms & Conditions
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center jiomart-header px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Button
            variant="jiomartHeader"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* App logo */}
          <span className="app-logo text-white font-medium text-xl">Consumer Products</span>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6" />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Location */}
            <div className="flex items-center gap-x-2 text-white">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Deliver to</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            {/* Shopping Cart */}
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                1
              </span>
            </div>
            {/* User Profile */}
            <div className="flex items-center gap-x-2 text-white">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 