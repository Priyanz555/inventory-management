"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Download, 
  Upload, 
  Search,
  Edit,
  Save,
  X,
  Filter,
  Settings,
  Database,
  Eye,
  Calendar,
  Package,
  DollarSign,
  AlertTriangle
} from "lucide-react"

interface ArticleMaster {
  id: string
  articleId: string
  articleName: string
  category: string
  subCategory: string
  baseUnit: 'CS' | 'EA'
  eaPerCase: number
  status: 'Active' | 'Inactive'
  dateAdded: string
  ptdPrice: number
  lastBillingDate: string
  safetyStock: number
  moq: number
}

export default function AdminPage() {
  const [articles, setArticles] = useState<ArticleMaster[]>([])
  const [filteredArticles, setFilteredArticles] = useState<ArticleMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Partial<ArticleMaster>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    baseUnit: '',
    status: '',
    dateAdded: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data
  const mockArticles: ArticleMaster[] = [
    {
      id: '1',
      articleId: 'ART001',
      articleName: 'Campa Cola 1L',
      category: 'Beverages',
      subCategory: 'Carbonated Drinks',
      baseUnit: 'CS',
      eaPerCase: 12,
      status: 'Active',
      dateAdded: '2024-01-15',
      ptdPrice: 180.00,
      lastBillingDate: '2024-07-30',
      safetyStock: 50,
      moq: 10
    },
    {
      id: '2',
      articleId: 'ART002',
      articleName: 'Campa Lemon 1L',
      category: 'Beverages',
      subCategory: 'Carbonated Drinks',
      baseUnit: 'CS',
      eaPerCase: 12,
      status: 'Active',
      dateAdded: '2024-01-20',
      ptdPrice: 175.00,
      lastBillingDate: '2024-07-28',
      safetyStock: 45,
      moq: 8
    },
    {
      id: '3',
      articleId: 'ART003',
      articleName: 'Raskik Mixed Fruit Juice 500 ML',
      category: 'Beverages',
      subCategory: 'Juices',
      baseUnit: 'CS',
      eaPerCase: 24,
      status: 'Active',
      dateAdded: '2024-02-01',
      ptdPrice: 240.00,
      lastBillingDate: '2024-07-29',
      safetyStock: 60,
      moq: 12
    },
    {
      id: '4',
      articleId: 'ART004',
      articleName: 'Independence Namkeen 200g',
      category: 'Packaged Foods & Snacks',
      subCategory: 'Namkeen',
      baseUnit: 'EA',
      eaPerCase: 1,
      status: 'Active',
      dateAdded: '2024-02-05',
      ptdPrice: 45.00,
      lastBillingDate: '2024-07-25',
      safetyStock: 80,
      moq: 15
    },
    {
      id: '5',
      articleId: 'ART005',
      articleName: 'Good Life Besan 500g',
      category: 'Packaged Foods & Snacks',
      subCategory: 'Staples',
      baseUnit: 'EA',
      eaPerCase: 1,
      status: 'Active',
      dateAdded: '2024-02-10',
      ptdPrice: 35.00,
      lastBillingDate: '2024-07-26',
      safetyStock: 100,
      moq: 20
    },
    {
      id: '6',
      articleId: 'ART006',
      articleName: 'Toffeeman',
      category: 'Packaged Foods & Snacks',
      subCategory: 'Chocolates and Candies',
      baseUnit: 'EA',
      eaPerCase: 1,
      status: 'Active',
      dateAdded: '2024-02-12',
      ptdPrice: 15.00,
      lastBillingDate: '2024-07-27',
      safetyStock: 150,
      moq: 30
    },
    {
      id: '7',
      articleId: 'ART007',
      articleName: 'Independence Whole Wheat Ata 5Kg',
      category: 'Packaged Foods & Snacks',
      subCategory: 'Staples',
      baseUnit: 'EA',
      eaPerCase: 1,
      status: 'Active',
      dateAdded: '2024-02-15',
      ptdPrice: 120.00,
      lastBillingDate: '2024-07-24',
      safetyStock: 40,
      moq: 8
    },
    {
      id: '8',
      articleId: 'ART008',
      articleName: 'Snac Tac Bikaneri Bhujia 750g',
      category: 'Packaged Foods & Snacks',
      subCategory: 'Namkeen',
      baseUnit: 'EA',
      eaPerCase: 1,
      status: 'Active',
      dateAdded: '2024-02-18',
      ptdPrice: 85.00,
      lastBillingDate: '2024-07-23',
      safetyStock: 70,
      moq: 14
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles)
      setFilteredArticles(mockArticles)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters and search
    let filtered = articles

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.articleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.articleName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(article => article.category === filters.category)
    }
    if (filters.subCategory) {
      filtered = filtered.filter(article => article.subCategory === filters.subCategory)
    }
    if (filters.baseUnit) {
      filtered = filtered.filter(article => article.baseUnit === filters.baseUnit)
    }
    if (filters.status) {
      filtered = filtered.filter(article => article.status === filters.status)
    }
    if (filters.dateAdded) {
      filtered = filtered.filter(article => article.dateAdded === filters.dateAdded)
    }

    setFilteredArticles(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [articles, searchTerm, filters])

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = filteredArticles.slice(startIndex, endIndex)

  const handleEdit = (id: string) => {
    const article = articles.find(a => a.id === id)
    if (article) {
      setEditingId(id)
      setEditingData(article)
    }
  }

  const handleSave = (id: string) => {
    setArticles(articles.map(article => 
      article.id === id ? { ...article, ...editingData } : article
    ))
    setEditingId(null)
    setEditingData({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingData({})
  }

  const handleEditChange = (field: keyof ArticleMaster, value: string | number) => {
    setEditingData(prev => ({ ...prev, [field]: value }))
  }

  const downloadMasterData = () => {
    // In a real implementation, this would download the master data
    console.log('Downloading master data...')
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Article ID,Article Name,Category,Sub Category,Base Unit,EA per Case,Status,Date Added,PTD Price,Last Billing Date,Safety Stock,MOQ\n" +
      articles.map(article => 
        `${article.articleId},${article.articleName},${article.category},${article.subCategory},${article.baseUnit},${article.eaPerCase},${article.status},${article.dateAdded},${article.ptdPrice},${article.lastBillingDate},${article.safetyStock},${article.moq}`
      ).join("\n")
    
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "master_data.csv")
    link.click()
  }

  const uploadMasterData = () => {
    // In a real implementation, this would upload the master data
    console.log('Uploading master data...')
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      baseUnit: '',
      status: '',
      dateAdded: ''
    })
    setSearchTerm('')
  }

  const categories = Array.from(new Set(articles.map(article => article.category)))
  const subCategories = Array.from(new Set(articles.map(article => article.subCategory)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(var(--button-blue))]" />
          <p className="text-gray-600">Loading article master data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
          <p className="text-gray-600">Manage article master data</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadMasterData} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Master Data
          </Button>
          <Button onClick={uploadMasterData} variant="jiomart" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Master Data
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[hsl(var(--button-blue))]" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Article ID or Article Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2 h-10">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select
                value={filters.subCategory}
                onChange={(e) => setFilters(prev => ({ ...prev, subCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="">All Sub Categories</option>
                {subCategories.map(subCategory => (
                  <option key={subCategory} value={subCategory}>{subCategory}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Unit</label>
              <select
                value={filters.baseUnit}
                onChange={(e) => setFilters(prev => ({ ...prev, baseUnit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="">All Units</option>
                <option value="CS">CS</option>
                <option value="EA">EA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Added</label>
              <Input
                type="date"
                value={filters.dateAdded}
                onChange={(e) => setFilters(prev => ({ ...prev, dateAdded: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article Master Data Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[hsl(var(--button-blue))]" />
            Article Master Data
          </CardTitle>
          <CardDescription>
            {filteredArticles.length} articles found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Unique identifier for the article">Article ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Name of the product/article">Article Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Product category classification">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Base unit of measurement (CS = Case, EA = Each)">Base Unit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Number of individual units per case">EA per Case</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Current status of the article">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Date when article was added to master data">Date Added</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Price to Distributor (PTD) in rupees">PTD Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Date of last billing transaction">Last Billing</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Minimum stock level to maintain">Safety Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Minimum Order Quantity">MOQ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700" title="Edit or manage article data">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentArticles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">
                      {article.articleId}
                    </td>
                    <td className="py-3 px-4">
                      {article.articleName}
                    </td>
                    <td className="py-3 px-4">
                      {article.category}
                    </td>
                    <td className="py-3 px-4">
                      {article.baseUnit}
                    </td>
                    <td className="py-3 px-4">
                      {article.eaPerCase}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === article.id ? (
                        <select
                          value={editingData.status || ''}
                          onChange={(e) => handleEditChange('status', e.target.value as 'Active' | 'Inactive')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                        >
                          <option value="">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {article.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(article.dateAdded).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === article.id ? (
                        <Input
                          type="number"
                          value={editingData.ptdPrice || ''}
                          onChange={(e) => handleEditChange('ptdPrice', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      ) : (
                        `₹${article.ptdPrice.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === article.id ? (
                        <Input
                          type="date"
                          value={editingData.lastBillingDate || ''}
                          onChange={(e) => handleEditChange('lastBillingDate', e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        new Date(article.lastBillingDate).toLocaleDateString('en-GB')
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === article.id ? (
                        <Input
                          type="number"
                          value={editingData.safetyStock || ''}
                          onChange={(e) => handleEditChange('safetyStock', parseInt(e.target.value, 10))}
                          className="w-full"
                        />
                      ) : (
                        article.safetyStock
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === article.id ? (
                        <Input
                          type="number"
                          value={editingData.moq || ''}
                          onChange={(e) => handleEditChange('moq', parseInt(e.target.value, 10))}
                          className="w-full"
                        />
                      ) : (
                        article.moq
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {editingId === article.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSave(article.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(article.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredArticles.length)} of {filteredArticles.length} results
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 