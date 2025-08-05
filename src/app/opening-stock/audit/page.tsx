"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Eye,
  Calendar,
  User,
  Filter,
  Search,
  FileText
} from "lucide-react"

export default function OpeningStockAuditPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    status: ''
  })

  // Mock data - in real implementation this would come from API
  const auditLogs = [
    {
      id: 1,
      timestamp: "2025-01-15 14:30:25",
      user: "john.doe@company.com",
      fileName: "opening_stock_jan_2025.xlsx",
      totalRows: 150,
      validRows: 145,
      errorRows: 5,
      status: "Committed",
      hasFile: true
    },
    {
      id: 2,
      timestamp: "2025-01-14 09:15:10",
      user: "jane.smith@company.com",
      fileName: "inventory_upload_jan14.xlsx",
      totalRows: 89,
      validRows: 89,
      errorRows: 0,
      status: "Committed",
      hasFile: true
    },
    {
      id: 3,
      timestamp: "2025-01-13 16:45:33",
      user: "mike.wilson@company.com",
      fileName: "stock_data_jan13.xlsx",
      totalRows: 200,
      validRows: 180,
      errorRows: 20,
      status: "Committed-with-Edits",
      hasFile: true
    },
    {
      id: 4,
      timestamp: "2025-01-12 11:20:45",
      user: "sarah.jones@company.com",
      fileName: "opening_stock_attempt.xlsx",
      totalRows: 75,
      validRows: 0,
      errorRows: 75,
      status: "Aborted",
      hasFile: false
    },
    {
      id: 5,
      timestamp: "2025-01-11 13:05:18",
      user: "david.brown@company.com",
      fileName: "inventory_jan11.xlsx",
      totalRows: 120,
      validRows: 120,
      errorRows: 0,
      status: "Committed",
      hasFile: true
    }
  ]

  const statusColors = {
    "Committed": "bg-green-100 text-green-800",
    "Committed-with-Edits": "bg-blue-100 text-blue-800",
    "Aborted": "bg-red-100 text-red-800"
  }

  const downloadFile = (fileName: string) => {
    // In real implementation, this would download the file
    console.log('Downloading file:', fileName)
  }

  const viewDetails = (id: number) => {
    // In real implementation, this would open the review screen in read-only mode
    console.log('Viewing details for audit log:', id)
  }

  const applyFilters = () => {
    // In real implementation, this would apply the filters to the API call
    console.log('Applying filters:', filters)
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      user: '',
      status: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Inventory Audit Trail</h1>
          <p className="text-gray-600">View all upload attempts and their results.</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter audit logs by date range, user, and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({...filters, user: e.target.value})}
                placeholder="Enter user email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Committed">Committed</option>
                <option value="Committed-with-Edits">Committed with Edits</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            All upload attempts with their results and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">File Name</th>
                  <th className="text-left py-3 px-4 font-medium">Total Rows</th>
                  <th className="text-left py-3 px-4 font-medium">Valid Rows</th>
                  <th className="text-left py-3 px-4 font-medium">Error Rows</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {log.user}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        {log.fileName}
                        {log.hasFile && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadFile(log.fileName)}
                            className="ml-2"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{log.totalRows}</td>
                    <td className="py-3 px-4 text-green-600">{log.validRows}</td>
                    <td className="py-3 px-4 text-red-600">{log.errorRows}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[log.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewDetails(log.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing 1 to 5 of 5 results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 