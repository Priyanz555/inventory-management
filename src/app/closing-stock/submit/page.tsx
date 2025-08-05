"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  BarChart3,
  Eye,
  XCircle,
  Play,
  Calendar,
  RefreshCw
} from "lucide-react"

interface StockClosingTask {
  id: string
  date: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  dueDate: string
  uploadTime?: string
  progress: number
  validationErrors: number
  varianceCount: number
}

interface StockItem {
  skuId: string
  systemQtyCS: number
  systemQtyEA: number
  physicalQtyCS: number
  physicalQtyEA: number
  damagedCS: number
  lostCS: number
  expiredCS: number
  sellableCS: number
  damagedEA: number
  lostEA: number
  expiredEA: number
  sellableEA: number
  varianceCS: number
  varianceEA: number
  reasonCode?: string
  validationError?: string
}

export default function ClosingStockPage() {
  const [selectedTask, setSelectedTask] = useState<StockClosingTask | null>(null)
  const [showVarianceModal, setShowVarianceModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState<StockItem[]>([])
  const [varianceItems, setVarianceItems] = useState<StockItem[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'validation' | 'variance' | 'completed'>('upload')

  const stockClosingTasks: StockClosingTask[] = [
    {
      id: "1",
      date: "2024-01-25",
      status: "pending",
      dueDate: "2024-01-25",
      progress: 0,
      validationErrors: 0,
      varianceCount: 0
    },
    {
      id: "2",
      date: "2024-01-24",
      status: "completed",
      dueDate: "2024-01-24",
      uploadTime: "2024-01-24 18:30:00",
      progress: 100,
      validationErrors: 0,
      varianceCount: 0
    },
    {
      id: "3",
      date: "2024-01-23",
      status: "completed",
      dueDate: "2024-01-23",
      uploadTime: "2024-01-23 19:15:00",
      progress: 100,
      validationErrors: 0,
      varianceCount: 0
    },
    {
      id: "4",
      date: "2024-01-22",
      status: "overdue",
      dueDate: "2024-01-22",
      progress: 0,
      validationErrors: 0,
      varianceCount: 0
    }
  ]

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`
      case "in_progress":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "overdue":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const downloadTemplate = () => {
    // In a real app, this would generate and download the Excel template
    console.log("Downloading stock closing template")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
                     // Simulate validation
           setTimeout(() => {
             const mockValidationErrors = [
               {
                 skuId: "SKU001",
                 systemQtyCS: 100,
                 systemQtyEA: 2400,
                 physicalQtyCS: 95,
                 physicalQtyEA: 2280,
                 damagedCS: 2,
                 lostCS: 1,
                 expiredCS: 0,
                 sellableCS: 92,
                 damagedEA: 48,
                 lostEA: 24,
                 expiredEA: 0,
                 sellableEA: 2208,
                 varianceCS: -5,
                 varianceEA: -120,
                 validationError: "Physical quantity cannot be negative"
               },
               {
                 skuId: "SKU002",
                 systemQtyCS: 50,
                 systemQtyEA: 1200,
                 physicalQtyCS: -2,
                 physicalQtyEA: -48,
                 damagedCS: 1,
                 lostCS: 0,
                 expiredCS: 0,
                 sellableCS: 47,
                 damagedEA: 24,
                 lostEA: 0,
                 expiredEA: 0,
                 sellableEA: 1128,
                 varianceCS: -52,
                 varianceEA: -1248,
                 validationError: "Physical quantity cannot be negative"
               },
               {
                 skuId: "SKU003",
                 systemQtyCS: 75,
                 systemQtyEA: 1800,
                 physicalQtyCS: 80,
                 physicalQtyEA: 1920,
                 damagedCS: 0,
                 lostCS: 0,
                 expiredCS: 0,
                 sellableCS: 80,
                 damagedEA: 0,
                 lostEA: 0,
                 expiredEA: 0,
                 sellableEA: 1920,
                 varianceCS: 5,
                 varianceEA: 120,
                 validationError: "Sellable quantity exceeds physical quantity"
               }
             ]
             setValidationErrors(mockValidationErrors)
             setCurrentStep('validation')
           }, 2000)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Reset file input
    event.target.value = ''
  }

  const handleValidationComplete = () => {
    setCurrentStep('variance')
    // Simulate variance calculation
    setTimeout(() => {
      const mockVarianceItems = [
        {
          skuId: "SKU002",
          systemQtyCS: 50,
          systemQtyEA: 1200,
          physicalQtyCS: 48,
          physicalQtyEA: 1152,
          damagedCS: 1,
          lostCS: 0,
          expiredCS: 0,
          sellableCS: 47,
          damagedEA: 24,
          lostEA: 0,
          expiredEA: 0,
          sellableEA: 1128,
          varianceCS: -2,
          varianceEA: -48
        }
      ]
      setVarianceItems(mockVarianceItems)
      setShowVarianceModal(true)
    }, 1000)
  }

  const handleVarianceComplete = () => {
    setShowVarianceModal(false)
    // Update task status to completed
    if (selectedTask) {
      console.log("Stock closing completed for:", selectedTask.date)
    }
  }

  const submitClosingStock = () => {
    // In a real app, this would submit the final data
    console.log("Submitting closing stock data")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Closing</h1>
          <p className="text-gray-600">Daily stock closing activities and variance tracking</p>
        </div>
        
        {/* Daily Task Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-medium text-orange-800">Daily Task Required</h3>
                <p className="text-sm text-orange-700">
                  Stock closing activity must be completed daily. Today's task is pending.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Stock Closing Tasks
          </CardTitle>
          <CardDescription>
            Daily stock closing tasks with due dates and completion status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stockClosingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Stock Closing - {task.date}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Due: {task.dueDate}
                      {task.uploadTime && ` • Uploaded: ${task.uploadTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={getStatusBadge(task.status)}>
                    {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                  {task.progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{task.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Task Details */}
      {selectedTask && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Stock Closing - {selectedTask.date}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Status</h3>
                <span className={getStatusBadge(selectedTask.status)}>
                  {selectedTask.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                </span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Due Date</h3>
                <p className="text-gray-600">{selectedTask.dueDate}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Progress</h3>
                <p className="text-gray-600">{selectedTask.progress}%</p>
              </div>
            </div>

                         {selectedTask.status === 'pending' && currentStep === 'upload' && (
               <div className="space-y-4">
                 <div className="flex gap-2">
                   <Button onClick={downloadTemplate} className="flex items-center gap-2">
                     <Download className="h-4 w-4" />
                     Download Template
                   </Button>
                   <div className="relative">
                     <Input
                       type="file"
                       accept=".xlsx,.xls"
                       onChange={handleFileUpload}
                       className="hidden"
                       id="file-upload"
                     />
                     <Button
                       onClick={() => document.getElementById('file-upload')?.click()}
                       variant="outline"
                       className="flex items-center gap-2"
                       disabled={isUploading}
                     >
                       <Upload className="h-4 w-4" />
                       {isUploading ? 'Uploading...' : 'Upload Excel'}
                     </Button>
                   </div>
                 </div>

                 {isUploading && (
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <RefreshCw className="h-4 w-4 animate-spin" />
                       <span className="text-sm text-gray-600">Uploading and validating data...</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className="bg-blue-600 h-2 rounded-full transition-all" 
                         style={{ width: `${uploadProgress}%` }}
                       />
                     </div>
                   </div>
                 )}

                 <div className="text-sm text-gray-600">
                   <p><strong>Template includes:</strong></p>
                   <ul className="list-disc list-inside mt-1 space-y-1">
                     <li>SKU ID</li>
                     <li>System QTY (CS/EA)</li>
                     <li>Physical QTY (CS/EA)</li>
                     <li>Damaged, Lost, Expired, Sellable (CS/EA)</li>
                   </ul>
                 </div>
               </div>
             )}

             {/* Validation Errors Section */}
             {selectedTask.status === 'pending' && currentStep === 'validation' && (
               <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-4">
                   <AlertCircle className="h-5 w-5 text-red-600" />
                   <h3 className="text-lg font-medium text-red-800">Validation Errors Found</h3>
                 </div>
                 
                 <p className="text-gray-600">
                   Please correct the following validation errors before proceeding:
                 </p>
                 
                 <div className="overflow-x-auto">
                   <table className="w-full border-collapse border border-gray-300">
                     <thead className="bg-red-50">
                       <tr>
                         <th className="border border-gray-300 px-4 py-2 text-left">SKU ID</th>
                         <th className="border border-gray-300 px-4 py-2 text-left">System QTY (CS)</th>
                         <th className="border border-gray-300 px-4 py-2 text-left">Physical QTY (CS)</th>
                         <th className="border border-gray-300 px-4 py-2 text-left">Sellable QTY (CS)</th>
                         <th className="border border-gray-300 px-4 py-2 text-left">Error</th>
                         <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                       </tr>
                     </thead>
                     <tbody>
                       {validationErrors.map((item, index) => (
                         <tr key={index} className="hover:bg-red-50">
                           <td className="border border-gray-300 px-4 py-2 font-medium">{item.skuId}</td>
                           <td className="border border-gray-300 px-4 py-2">{item.systemQtyCS}</td>
                           <td className="border border-gray-300 px-4 py-2">
                             <Input
                               type="number"
                               value={item.physicalQtyCS}
                               className="w-20"
                               onChange={(e) => {
                                 const newErrors = [...validationErrors]
                                 newErrors[index].physicalQtyCS = parseInt(e.target.value) || 0
                                 setValidationErrors(newErrors)
                               }}
                             />
                           </td>
                           <td className="border border-gray-300 px-4 py-2">
                             <Input
                               type="number"
                               value={item.sellableCS}
                               className="w-20"
                               onChange={(e) => {
                                 const newErrors = [...validationErrors]
                                 newErrors[index].sellableCS = parseInt(e.target.value) || 0
                                 setValidationErrors(newErrors)
                               }}
                             />
                           </td>
                           <td className="border border-gray-300 px-4 py-2 text-red-600 text-sm">
                             {item.validationError}
                           </td>
                           <td className="border border-gray-300 px-4 py-2">
                             <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                               ✓ Fixed
                             </Button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
                 
                 <div className="flex justify-end gap-2">
                   <Button
                     onClick={() => setCurrentStep('upload')}
                     variant="outline"
                   >
                     Back to Upload
                   </Button>
                   <Button
                     onClick={handleValidationComplete}
                     className="bg-green-600 hover:bg-green-700"
                     disabled={validationErrors.length > 0}
                   >
                     Continue to Variance Analysis
                   </Button>
                 </div>
               </div>
             )}

            {selectedTask.status === 'completed' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Completed</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      

      {/* Variance Modal */}
      {showVarianceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Variance Analysis</h2>
              <Button
                onClick={() => setShowVarianceModal(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Please assign reason codes to the following variances:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">SKU ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">System QTY (CS)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Physical QTY (CS)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Variance (CS)</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Reason Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varianceItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{item.skuId}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.systemQtyCS}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.physicalQtyCS}</td>
                        <td className={`border border-gray-300 px-4 py-2 ${
                          item.varianceCS < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.varianceCS > 0 ? '+' : ''}{item.varianceCS}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <select className="w-full border rounded px-2 py-1">
                            <option value="">Select Reason</option>
                            <option value="damage">Damage</option>
                            <option value="theft">Theft</option>
                            <option value="expiry">Expiry</option>
                            <option value="counting_error">Counting Error</option>
                            <option value="system_error">System Error</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowVarianceModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleVarianceComplete}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Closing Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 