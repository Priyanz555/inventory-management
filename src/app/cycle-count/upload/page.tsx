'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';

interface InventoryItem {
  skuId: string;
  description: string;
  dateAdded: string;
  mfgDate: string;
  baseUnit: 'CS' | 'EA';
  inventoryOnHand: number;
  sellableQty: number;
  allocatedQty: number;
  damagedQty: number;
  expiredQty: number;
  onRouteQty: number;
  movements: InventoryMovement[];
  hasError?: boolean;
  errorMessage?: string;
}

interface InventoryMovement {
  id: string;
  type: 'sellable-to-expired' | 'expired-to-sellable' | 'sellable-to-damaged' | 'damaged-to-sellable' | 'sellable-to-allocated' | 'allocated-to-sellable';
  quantity: number;
  reasonCode?: string;
  newMfgDate?: string;
  hasError?: boolean;
  errorMessage?: string;
}

interface CycleCountSession {
  sessionId: string;
  initiatedAt: string;
  status: 'active' | 'cancelled' | 'completed';
  items: InventoryItem[];
}

const REASON_CODES = [
  { code: '1', description: 'WH Handling Damage' },
  { code: '2', description: 'Inbound Transit Loss' },
  { code: '3', description: 'Inbound Transit Shortage' },
  { code: '4', description: 'Market Return Damages' }
];

const MOVEMENT_TYPES = [
  { value: 'sellable-to-expired', label: 'Sellable → Expired', requiresReason: true, requiresMfgDate: true },
  { value: 'expired-to-sellable', label: 'Expired → Sellable', requiresReason: false, requiresMfgDate: true },
  { value: 'sellable-to-damaged', label: 'Sellable → Damaged', requiresReason: true, requiresMfgDate: false },
  { value: 'damaged-to-sellable', label: 'Damaged → Sellable', requiresReason: true, requiresMfgDate: false },
  { value: 'sellable-to-allocated', label: 'Sellable → Allocated', requiresReason: false, requiresMfgDate: false },
  { value: 'allocated-to-sellable', label: 'Allocated → Sellable', requiresReason: false, requiresMfgDate: false }
];

export default function CycleCountUploadPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<CycleCountSession | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cycleCountActive, setCycleCountActive] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkCycleCountStatus();
  }, []);

  // Auto-save draft every 30 seconds when there are changes
  useEffect(() => {
    if (!session || !cycleCountActive) return;

    const autoSaveInterval = setInterval(() => {
      if (session.items.some(item => item.movements.length > 0)) {
        saveDraft();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [session, cycleCountActive]);

  // Auto-save when user makes changes
  useEffect(() => {
    if (!session || !cycleCountActive) return;

    const timeoutId = setTimeout(() => {
      if (session.items.some(item => item.movements.length > 0)) {
        saveDraft();
      }
    }, 5000); // Save 5 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [session?.items, cycleCountActive]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session && session.items.some(item => item.movements.length > 0)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  const checkCycleCountStatus = async () => {
    try {
      const response = await fetch('/api/cycle-count/status');
      if (response.ok) {
        const data = await response.json();
        setCycleCountActive(data.active);
      }
    } catch (error) {
      console.error('Error checking cycle count status:', error);
    }
  };

  const initiateCycleCount = async () => {
    try {
      const response = await fetch('/api/cycle-count/initiate', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setCycleCountActive(true);
        setMessage('Cycle count initiated successfully. Order processing is now blocked.');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error initiating cycle count');
    }
  };

  const cancelCycleCount = async () => {
    if (!confirm('Are you sure you want to cancel the cycle count? This will result in lost data and restore order processing.')) {
      return;
    }

    try {
      const response = await fetch('/api/cycle-count/cancel', {
        method: 'POST'
      });
      
      if (response.ok) {
        setSession(null);
        setCycleCountActive(false);
        setMessage('Cycle count cancelled. Order processing restored.');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error cancelling cycle count');
    }
  };

  const loadInventoryData = async () => {
    if (!cycleCountActive) {
      setMessage('Please initiate a cycle count first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cycle-count/snapshot');
      if (response.ok) {
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const items: InventoryItem[] = [];
        
        // Skip header row and parse data
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const matches = line.match(/(".*?"|[^,]+)/g) || [];
          const row = matches.map(cell => cell.replace(/^"|"$/g, '').trim());
          
          if (row.length >= 11 && row[0] && row[0] !== 'SKU ID') {
            const item: InventoryItem = {
              skuId: row[0],
              description: row[1],
              dateAdded: row[2],
              mfgDate: row[3],
              baseUnit: (row[4] as 'CS' | 'EA') || 'CS',
              inventoryOnHand: parseFloat(row[5]) || 0,
              sellableQty: parseFloat(row[6]) || 0,
              allocatedQty: parseFloat(row[7]) || 0,
              damagedQty: parseFloat(row[8]) || 0,
              expiredQty: parseFloat(row[9]) || 0,
              onRouteQty: parseFloat(row[10]) || 0,
              movements: []
            };
            items.push(item);
          }
        }

        const sessionId = Date.now().toString();
        const newSession: CycleCountSession = {
          sessionId,
          initiatedAt: new Date().toISOString(),
          status: 'active',
          items
        };
        
        setSession(newSession);
        setMessage(`Inventory data loaded successfully. ${items.length} items available for adjustment.`);
      } else {
        setMessage('Error loading inventory data');
      }
    } catch (error) {
      console.error('Error loading inventory data:', error);
      setMessage('Error loading inventory data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (skuId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(skuId)) {
      newExpandedRows.delete(skuId);
    } else {
      newExpandedRows.add(skuId);
    }
    setExpandedRows(newExpandedRows);
  };

  const addMovement = (skuId: string) => {
    if (!session) return;

    const updatedItems = session.items.map(item => {
      if (item.skuId === skuId) {
        const newMovement: InventoryMovement = {
          id: Date.now().toString(),
          type: 'sellable-to-damaged',
          quantity: 0,
          reasonCode: '',
          newMfgDate: ''
        };
        return {
          ...item,
          movements: [...item.movements, newMovement]
        };
      }
      return item;
    });

    setSession({ ...session, items: updatedItems });
  };

  const removeMovement = (skuId: string, movementId: string) => {
    if (!session) return;

    const updatedItems = session.items.map(item => {
      if (item.skuId === skuId) {
        return {
          ...item,
          movements: item.movements.filter(m => m.id !== movementId)
        };
      }
      return item;
    });

    setSession({ ...session, items: updatedItems });
  };

  const updateMovement = (skuId: string, movementId: string, field: keyof InventoryMovement, value: any) => {
    if (!session) return;

    const updatedItems = session.items.map(item => {
      if (item.skuId === skuId) {
        const updatedMovements = item.movements.map(movement => {
          if (movement.id === movementId) {
            const updatedMovement = { ...movement, [field]: value };
            
            // Clear individual movement errors initially
            return {
              ...updatedMovement,
              hasError: false,
              errorMessage: ''
            };
          }
          return movement;
        });

        // Create updated item with new movements
        const updatedItem = {
          ...item,
          movements: updatedMovements
        };

        // Validate the entire item with all movements
        const validationErrors = validateMovements(updatedItem);
        
        return {
          ...updatedItem,
          hasError: validationErrors.length > 0,
          errorMessage: validationErrors.join('; ')
        };
      }
      return item;
    });

    setSession({ ...session, items: updatedItems });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD-MM-YYYY format
  };

  const calculateMovementTotals = (movements: InventoryMovement[]) => {
    const totals = {
      sellableToExpired: 0,
      expiredToSellable: 0,
      sellableToDamaged: 0,
      damagedToSellable: 0,
      sellableToAllocated: 0,
      allocatedToSellable: 0,
      netSellableChange: 0,
      netExpiredChange: 0,
      netDamagedChange: 0,
      netAllocatedChange: 0
    };

    movements.forEach(movement => {
      switch (movement.type) {
        case 'sellable-to-expired':
          totals.sellableToExpired += movement.quantity;
          totals.netSellableChange -= movement.quantity;
          totals.netExpiredChange += movement.quantity;
          break;
        case 'expired-to-sellable':
          totals.expiredToSellable += movement.quantity;
          totals.netExpiredChange -= movement.quantity;
          totals.netSellableChange += movement.quantity;
          break;
        case 'sellable-to-damaged':
          totals.sellableToDamaged += movement.quantity;
          totals.netSellableChange -= movement.quantity;
          totals.netDamagedChange += movement.quantity;
          break;
        case 'damaged-to-sellable':
          totals.damagedToSellable += movement.quantity;
          totals.netDamagedChange -= movement.quantity;
          totals.netSellableChange += movement.quantity;
          break;
        case 'sellable-to-allocated':
          totals.sellableToAllocated += movement.quantity;
          totals.netSellableChange -= movement.quantity;
          totals.netAllocatedChange += movement.quantity;
          break;
        case 'allocated-to-sellable':
          totals.allocatedToSellable += movement.quantity;
          totals.netAllocatedChange -= movement.quantity;
          totals.netSellableChange += movement.quantity;
          break;
      }
    });

    return totals;
  };

  const validateMovements = (item: InventoryItem) => {
    const errors: string[] = [];
    const totals = calculateMovementTotals(item.movements);

    // Check if movements would result in negative quantities
    if (item.sellableQty + totals.netSellableChange < 0) {
      errors.push(`Sellable quantity would become negative (${item.sellableQty + totals.netSellableChange})`);
    }
    if (item.expiredQty + totals.netExpiredChange < 0) {
      errors.push(`Expired quantity would become negative (${item.expiredQty + totals.netExpiredChange})`);
    }
    if (item.damagedQty + totals.netDamagedChange < 0) {
      errors.push(`Damaged quantity would become negative (${item.damagedQty + totals.netDamagedChange})`);
    }
    if (item.allocatedQty + totals.netAllocatedChange < 0) {
      errors.push(`Allocated quantity would become negative (${item.allocatedQty + totals.netAllocatedChange})`);
    }

    // Check for invalid movements
    item.movements.forEach((movement, index) => {
      if (movement.quantity <= 0) {
        errors.push(`Movement ${index + 1}: Quantity must be greater than 0`);
      }
      
      const movementType = MOVEMENT_TYPES.find(mt => mt.value === movement.type);
      if (movementType?.requiresReason && !movement.reasonCode) {
        errors.push(`Movement ${index + 1}: Reason code is required`);
      }
      if (movementType?.requiresMfgDate && !movement.newMfgDate) {
        errors.push(`Movement ${index + 1}: New MFG date is required`);
      }
    });

    return errors;
  };

  const saveDraft = async () => {
    if (!session) return;

    setIsSaving(true);
    try {
      const draftData = {
        sessionId: session.sessionId,
        items: session.items,
        expandedRows: Array.from(expandedRows),
        lastModified: new Date().toISOString()
      };

      // Save to localStorage for immediate persistence
      localStorage.setItem(`cycle_count_draft_${session.sessionId}`, JSON.stringify(draftData));
      
      // Also save to API for server-side persistence
      const response = await fetch('/api/cycle-count/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setMessage('Draft saved successfully!');
      } else {
        console.warn('Failed to save draft to server, but saved locally');
        setLastSaved(new Date());
        setMessage('Draft saved locally (server save failed)');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setMessage('Error saving draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadDraft = async () => {
    if (!session) return;

    try {
      // Try to load from localStorage first
      const localDraft = localStorage.getItem(`cycle_count_draft_${session.sessionId}`);
      if (localDraft) {
        const draftData = JSON.parse(localDraft);
        setSession({ ...session, items: draftData.items });
        setExpandedRows(new Set(draftData.expandedRows || []));
        setLastSaved(new Date(draftData.lastModified));
        setMessage('Draft loaded successfully!');
        return;
      }

      // If no local draft, try to load from server
      const response = await fetch(`/api/cycle-count/draft?sessionId=${session.sessionId}`);
      if (response.ok) {
        const draftData = await response.json();
        setSession({ ...session, items: draftData.items });
        setExpandedRows(new Set(draftData.expandedRows || []));
        setLastSaved(new Date(draftData.lastModified));
        setMessage('Draft loaded from server successfully!');
      } else {
        setMessage('No draft found to load.');
      }
    } catch (error) {
      console.error('Error loading draft:', error);
      setMessage('Error loading draft. Please try again.');
    }
  };

  const clearDraft = () => {
    if (!session) return;

    if (confirm('Are you sure you want to clear the draft? This action cannot be undone.')) {
      localStorage.removeItem(`cycle_count_draft_${session.sessionId}`);
      setLastSaved(null);
      setMessage('Draft cleared successfully!');
    }
  };

  const validateAndSubmit = async () => {
    if (!session?.items) {
      setMessage('No data to submit');
      return;
    }

    // Validate all items with their movements
    const updatedItems = session.items.map(item => {
      const validationErrors = validateMovements(item);
      return {
        ...item,
        hasError: validationErrors.length > 0,
        errorMessage: validationErrors.join('; ')
      };
    });

    const updatedSession = { ...session, items: updatedItems };
    setSession(updatedSession);

    // Check for validation errors
    const hasErrors = updatedItems.some(item => item.hasError);
    if (hasErrors) {
      setMessage('Please fix all validation errors before submitting');
      return;
    }

    // Send OTP before showing modal
    try {
      const response = await fetch('/api/cycle-count/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          userEmail: 'current-user@company.com' // In real implementation, get from session
        }),
      });

      if (response.ok) {
        setMessage('OTP sent to your registered mobile number. Please check and enter the code.');
        setShowOtpModal(true);
      } else {
        const error = await response.json();
        setMessage(`Error sending OTP: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const submitWithOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setSubmitting(true);
    try {
      // Convert movements back to the old format for API compatibility
      const itemsForApi = session?.items.map((item: InventoryItem) => {
        const sellableToExpired = item.movements
          .filter((m: InventoryMovement) => m.type === 'sellable-to-expired')
          .reduce((sum: number, m: InventoryMovement) => sum + m.quantity, 0);
        
        const expiredToSellable = item.movements
          .filter((m: InventoryMovement) => m.type === 'expired-to-sellable')
          .reduce((sum: number, m: InventoryMovement) => sum + m.quantity, 0);
        
        const sellableToDamaged = item.movements
          .filter((m: InventoryMovement) => m.type === 'sellable-to-damaged')
          .reduce((sum: number, m: InventoryMovement) => sum + m.quantity, 0);
        
        const damagedToSellable = item.movements
          .filter((m: InventoryMovement) => m.type === 'damaged-to-sellable')
          .reduce((sum: number, m: InventoryMovement) => sum + m.quantity, 0);

        // Get reason code from first movement that requires it
        const reasonCode = item.movements.find((m: InventoryMovement) => 
          MOVEMENT_TYPES.find(mt => mt.value === m.type)?.requiresReason
        )?.reasonCode;

        // Get new MFG date from first movement that requires it
        const newMfgDate = item.movements.find((m: InventoryMovement) => 
          MOVEMENT_TYPES.find(mt => mt.value === m.type)?.requiresMfgDate
        )?.newMfgDate;

        return {
          ...item,
          sellableToExpired,
          expiredToSellable,
          sellableToDamaged,
          damagedToSellable,
          reasonCode,
          newMfgDate
        };
      });

      const response = await fetch('/api/cycle-count/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session?.sessionId,
          items: itemsForApi,
          otp: otp
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Cycle count submitted successfully!');
        setSession(null);
        setCycleCountActive(false);
        setShowOtpModal(false);
        setOtp('');
        
        // Download adjustment document
        const link = document.createElement('a');
        link.href = `/api/cycle-count/adjustment-document/${result.auditId}`;
        link.download = `inventory_adjustment_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error submitting cycle count');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cycle Count / Inventory Reconciliation</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Cycle Count Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cycle Count Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${cycleCountActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="font-medium">
                {cycleCountActive ? 'Cycle Count Active' : 'No Active Cycle Count'}
              </span>
            </div>
            <div className="space-x-2">
              {!cycleCountActive ? (
                <Button onClick={initiateCycleCount} className="bg-blue-600 hover:bg-blue-700">
                  Initiate Cycle Count
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={loadInventoryData}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Loading...' : 'Load Inventory Data'}
                  </Button>
                  <Button onClick={cancelCycleCount} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Cancel Cycle Count
                  </Button>
                </>
              )}
            </div>
          </div>
          {cycleCountActive && (
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Order processing is currently blocked during cycle count. Complete or cancel the cycle count to restore normal operations.
                </p>
              </div>
              
              {/* Draft Status */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-800 text-sm font-medium">Draft Auto-Save Active</span>
                  </div>
                  {lastSaved && (
                    <span className="text-blue-600 text-xs">
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className="text-blue-700 text-xs mt-1">
                  Your changes are automatically saved every 30 seconds and 5 seconds after modifications.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      {session?.items && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Items</CardTitle>
                <p className="text-sm text-gray-600">
                  Click on any row to add inventory movements. Use the accordion view to manage multiple movements per item.
                </p>
              </div>
              {session && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={saveDraft}
                    disabled={isSaving}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    onClick={loadDraft}
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    Load Draft
                  </Button>
                  <Button
                    onClick={clearDraft}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Clear Draft
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left w-8"></th>
                    <th className="border p-2 text-left">Article ID</th>
                    <th className="border p-2 text-left">Article Name</th>
                    <th className="border p-2 text-left">MFG Date</th>
                    <th className="border p-2 text-left">Base Unit</th>
                    <th className="border p-2 text-center">Inventory On Hand</th>
                    <th className="border p-2 text-center">Sellable</th>
                    <th className="border p-2 text-center">Allocated</th>
                    <th className="border p-2 text-center">Damaged</th>
                    <th className="border p-2 text-center">Expired</th>
                    <th className="border p-2 text-center">On Route</th>
                    <th className="border p-2 text-center">Movements</th>
                  </tr>
                </thead>
                <tbody>
                  {session.items.map((item, index) => {
                    const isExpanded = expandedRows.has(item.skuId);
                    const hasMovements = item.movements.length > 0;
                    
                    return (
                      <>
                        <tr 
                          key={item.skuId} 
                          className={`${item.hasError ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                          onClick={() => toggleRowExpansion(item.skuId)}
                        >
                          <td className="border p-2 text-center">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </td>
                          <td className="border p-2 font-medium">{item.skuId}</td>
                          <td className="border p-2">{item.description}</td>
                          <td className="border p-2">{formatDate(item.mfgDate)}</td>
                          <td className="border p-2">{item.baseUnit}</td>
                          <td className="border p-2 text-center">{item.inventoryOnHand}</td>
                          <td className="border p-2 text-center">{item.sellableQty}</td>
                          <td className="border p-2 text-center">{item.allocatedQty}</td>
                          <td className="border p-2 text-center">{item.damagedQty}</td>
                          <td className="border p-2 text-center">{item.expiredQty}</td>
                          <td className="border p-2 text-center">{item.onRouteQty}</td>
                          <td className="border p-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs ${hasMovements ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                              {item.movements.length} movement{item.movements.length !== 1 ? 's' : ''}
                            </span>
                          </td>
                        </tr>
                        
                        {/* Accordion Content */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={12} className="border p-0">
                              <div className="bg-gray-50 p-4">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-gray-800">
                                    Inventory Movements for {item.skuId}
                                  </h4>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addMovement(item.skuId);
                                    }}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Movement
                                  </Button>
                                </div>
                                
                                {/* Summary Cards */}
                                {item.movements.length > 0 && (
                                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Movement Totals */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                                      <h5 className="font-medium text-gray-800 mb-2 text-sm">Movement Totals</h5>
                                      {(() => {
                                        const totals = calculateMovementTotals(item.movements);
                                        return (
                                          <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Sellable → Expired:</span>
                                              <span className={`font-medium ${totals.sellableToExpired > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {totals.sellableToExpired}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Expired → Sellable:</span>
                                              <span className={`font-medium ${totals.expiredToSellable > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                {totals.expiredToSellable}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Sellable → Damaged:</span>
                                              <span className={`font-medium ${totals.sellableToDamaged > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                {totals.sellableToDamaged}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Damaged → Sellable:</span>
                                              <span className={`font-medium ${totals.damagedToSellable > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                {totals.damagedToSellable}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Sellable → Allocated:</span>
                                              <span className={`font-medium ${totals.sellableToAllocated > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {totals.sellableToAllocated}
                                              </span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Allocated → Sellable:</span>
                                              <span className={`font-medium ${totals.allocatedToSellable > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                                {totals.allocatedToSellable}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                    
                                    {/* Net Effect */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                      <h5 className="font-medium text-blue-800 mb-2 text-sm">Net Effect</h5>
                                      {(() => {
                                        const totals = calculateMovementTotals(item.movements);
                                        return (
                                          <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Inventory On Hand:</span>
                                              <div className="text-right">
                                                <span className="font-medium text-gray-700">
                                                  {item.inventoryOnHand}
                                                </span>
                                                <span className="text-gray-400 ml-1">
                                                  (unchanged)
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Sellable:</span>
                                              <div className="text-right">
                                                <span className={`font-medium ${totals.netSellableChange !== 0 ? 'font-bold' : ''} ${totals.netSellableChange > 0 ? 'text-green-600' : totals.netSellableChange < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                                  {totals.netSellableChange > 0 ? '+' : ''}{totals.netSellableChange}
                                                </span>
                                                <span className="text-gray-400 ml-1">
                                                  ({item.sellableQty + totals.netSellableChange})
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Allocated:</span>
                                              <div className="text-right">
                                                <span className={`font-medium ${totals.netAllocatedChange !== 0 ? 'font-bold' : ''} ${totals.netAllocatedChange > 0 ? 'text-blue-600' : totals.netAllocatedChange < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                  {totals.netAllocatedChange > 0 ? '+' : ''}{totals.netAllocatedChange}
                                                </span>
                                                <span className="text-gray-400 ml-1">
                                                  ({item.allocatedQty + totals.netAllocatedChange})
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Damaged:</span>
                                              <div className="text-right">
                                                <span className={`font-medium ${totals.netDamagedChange !== 0 ? 'font-bold' : ''} ${totals.netDamagedChange > 0 ? 'text-red-600' : totals.netDamagedChange < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                  {totals.netDamagedChange > 0 ? '+' : ''}{totals.netDamagedChange}
                                                </span>
                                                <span className="text-gray-400 ml-1">
                                                  ({item.damagedQty + totals.netDamagedChange})
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-gray-600">Expired:</span>
                                              <div className="text-right">
                                                <span className={`font-medium ${totals.netExpiredChange !== 0 ? 'font-bold' : ''} ${totals.netExpiredChange > 0 ? 'text-red-600' : totals.netExpiredChange < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                                  {totals.netExpiredChange > 0 ? '+' : ''}{totals.netExpiredChange}
                                                </span>
                                                <span className="text-gray-400 ml-1">
                                                  ({item.expiredQty + totals.netExpiredChange})
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Validation Errors */}
                                {item.hasError && (
                                  <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded">
                                    <h5 className="font-medium text-red-800 mb-2">Validation Errors</h5>
                                    <div className="text-red-700 text-sm">
                                      {item.errorMessage?.split('; ').map((error, index) => (
                                        <div key={index} className="mb-1">• {error}</div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {item.movements.length === 0 ? (
                                  <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">
                                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">No movements added yet</p>
                                    <p className="text-gray-400 text-xs">Click "Add Movement" to start</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {item.movements.map((movement, movementIndex) => (
                                      <div 
                                        key={movement.id} 
                                        className={`p-3 border rounded-lg ${movement.hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300 transition-colors'}`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                              #{movementIndex + 1}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">
                                              {MOVEMENT_TYPES.find(mt => mt.value === movement.type)?.label}
                                            </span>
                                          </div>
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeMovement(item.skuId, movement.id);
                                            }}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-6 w-6"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                          <div>
                                            <Label htmlFor={`movement-type-${movement.id}`} className="text-xs text-gray-600">Type</Label>
                                            <select
                                              id={`movement-type-${movement.id}`}
                                              value={movement.type}
                                              onChange={(e) => updateMovement(item.skuId, movement.id, 'type', e.target.value)}
                                              className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {MOVEMENT_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>
                                                  {type.label}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          
                                          <div>
                                            <Label htmlFor={`quantity-${movement.id}`} className="text-xs text-gray-600">Quantity</Label>
                                            <Input
                                              id={`quantity-${movement.id}`}
                                              type="number"
                                              value={movement.quantity}
                                              onChange={(e) => updateMovement(item.skuId, movement.id, 'quantity', Number(e.target.value))}
                                              className="text-xs p-1.5 h-8"
                                              onClick={(e) => e.stopPropagation()}
                                            />
                                          </div>
                                          
                                          {MOVEMENT_TYPES.find(mt => mt.value === movement.type)?.requiresReason && (
                                            <div>
                                              <Label htmlFor={`reason-${movement.id}`} className="text-xs text-gray-600">Reason</Label>
                                              <select
                                                id={`reason-${movement.id}`}
                                                value={movement.reasonCode || ''}
                                                onChange={(e) => updateMovement(item.skuId, movement.id, 'reasonCode', e.target.value)}
                                                className="w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <option value="">Select...</option>
                                                {REASON_CODES.map(code => (
                                                  <option key={code.code} value={code.code}>
                                                    {code.code} - {code.description}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          )}
                                          
                                          {MOVEMENT_TYPES.find(mt => mt.value === movement.type)?.requiresMfgDate && (
                                            <div>
                                              <Label htmlFor={`mfg-date-${movement.id}`} className="text-xs text-gray-600">New MFG Date</Label>
                                              <Input
                                                id={`mfg-date-${movement.id}`}
                                                type="date"
                                                value={movement.newMfgDate || ''}
                                                onChange={(e) => updateMovement(item.skuId, movement.id, 'newMfgDate', e.target.value)}
                                                className="text-xs p-1.5 h-8"
                                                onClick={(e) => e.stopPropagation()}
                                              />
                                            </div>
                                          )}
                                        </div>
                                        

                                        
                                        {movement.hasError && (
                                          <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-xs">
                                            {movement.errorMessage}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {item.hasError && (
                                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                                    {item.errorMessage}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                onClick={validateAndSubmit}
                disabled={session.items.some(item => item.hasError)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Submit Cycle Count
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">How to Perform Cycle Count:</h4>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Initiate Cycle Count:</strong> Click "Initiate Cycle Count" to start the process and block order processing</li>
                <li><strong>Load Inventory Data:</strong> Click "Load Inventory Data" to populate the grid with current inventory levels</li>
                <li><strong>Add Movements:</strong> Click on any inventory row to expand the accordion view</li>
                <li><strong>Create Movements:</strong> Click "Add Movement" to create new movement entries</li>
                <li><strong>Configure Movements:</strong> Select movement type, enter quantity, and provide required information</li>
                <li><strong>Save Progress:</strong> Your changes are automatically saved, or use "Save Draft" for manual saves</li>
                <li><strong>Validate:</strong> Ensure all required fields are completed and validation passes</li>
                <li><strong>Submit:</strong> Click "Submit Cycle Count" and verify with OTP to complete the process</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Draft Management:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Auto-Save:</strong> Changes are automatically saved every 30 seconds and 5 seconds after modifications</li>
                <li><strong>Manual Save:</strong> Use "Save Draft" button to manually save your progress</li>
                <li><strong>Load Draft:</strong> Use "Load Draft" to restore your previous work if you need to continue later</li>
                <li><strong>Clear Draft:</strong> Use "Clear Draft" to remove saved data (use with caution)</li>
                <li><strong>Browser Storage:</strong> Drafts are saved both locally and on the server for maximum safety</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Movement Types:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Sellable → Expired:</strong> Requires reason code and new MFG date</li>
                <li><strong>Expired → Sellable:</strong> Requires new MFG date</li>
                <li><strong>Sellable → Damaged:</strong> Requires reason code</li>
                <li><strong>Damaged → Sellable:</strong> Requires reason code</li>
                <li><strong>Sellable → Allocated:</strong> No additional requirements</li>
                <li><strong>Allocated → Sellable:</strong> No additional requirements</li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> All inventory adjustments are made through the accordion movement system. Click on any row to start adding movements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">OTP Verification</h3>
            <p className="text-gray-600 mb-4">
              Please enter the 6-digit OTP sent to your registered mobile number to confirm the cycle count submission. The OTP is valid for 10 minutes.
            </p>
            <div className="mb-4">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowOtpModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitWithOtp}
                disabled={otp.length !== 6 || submitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 