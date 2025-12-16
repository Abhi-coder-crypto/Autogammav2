import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, User, Car, Package, Trash2 } from 'lucide-react';

const SERVICE_STATUSES = ['Inquired', 'Working', 'Waiting', 'Completed'];

export default function CustomerService() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<string>('');
  const [serviceNotes, setServiceNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ inventoryId: string; quantity: number; name: string; price: number }[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<string>('1');

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.customers.list(),
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: api.inventory.list,
  });

  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: api.technicians.list,
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: any) => {
      const job = await api.jobs.create(data);
      if (selectedItems.length > 0) {
        try {
          await api.jobs.addMaterials(job._id, selectedItems.map(item => ({
            inventoryId: item.inventoryId,
            quantity: item.quantity
          })));
        } catch (error: any) {
          console.error('Failed to add materials:', error);
        }
      }
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      resetForm();
      toast({ title: 'Service created successfully!' });
    },
    onError: (error: any) => {
      toast({ title: error?.message || 'Failed to create service', variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setSelectedCustomerId('');
    setSelectedVehicleIndex('');
    setServiceNotes('');
    setSelectedItems([]);
    setSelectedItemId('');
    setItemQuantity('1');
  };

  const selectedCustomer = customers.find((c: any) => c._id === selectedCustomerId);

  const handleAddItem = () => {
    if (!selectedItemId) {
      toast({ title: 'Please select an item', variant: 'destructive' });
      return;
    }
    
    const item = inventory.find((inv: any) => inv._id === selectedItemId);
    if (!item) return;

    const qty = parseInt(itemQuantity, 10);
    
    if (isNaN(qty) || qty <= 0) {
      toast({ title: 'Please enter a valid quantity greater than 0', variant: 'destructive' });
      return;
    }
    
    if (qty > item.quantity) {
      toast({ title: `Only ${item.quantity} ${item.unit} available in stock`, variant: 'destructive' });
      return;
    }

    const existingIndex = selectedItems.findIndex(i => i.inventoryId === selectedItemId);
    if (existingIndex >= 0) {
      const newItems = [...selectedItems];
      const newQty = newItems[existingIndex].quantity + qty;
      if (newQty > item.quantity) {
        toast({ title: `Total would exceed available stock (${item.quantity} ${item.unit})`, variant: 'destructive' });
        return;
      }
      newItems[existingIndex].quantity = newQty;
      setSelectedItems(newItems);
    } else {
      setSelectedItems([...selectedItems, {
        inventoryId: selectedItemId,
        quantity: qty,
        name: item.name,
        price: item.price
      }]);
    }

    setSelectedItemId('');
    setItemQuantity('1');
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId || !selectedVehicleIndex) {
      toast({ title: 'Please select a customer and vehicle', variant: 'destructive' });
      return;
    }

    const customer = customers.find((c: any) => c._id === selectedCustomerId);
    if (!customer) return;

    const vehicleIdx = parseInt(selectedVehicleIndex, 10);
    const vehicle = customer.vehicles[vehicleIdx];
    if (!vehicle) return;

    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    createJobMutation.mutate({
      customerId: selectedCustomerId,
      vehicleIndex: vehicleIdx,
      customerName: customer.name,
      vehicleName: `${vehicle.make} ${vehicle.model}`.trim() || vehicle.model,
      plateNumber: vehicle.plateNumber,
      notes: serviceNotes,
      stage: 'New Lead',
      serviceItems: [],
      materials: [],
      totalAmount: totalAmount,
      paidAmount: 0,
      paymentStatus: 'Pending'
    });
  };

  const totalCost = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Customers Service</h1>
        <p className="text-muted-foreground mt-1">Create services for customers with inventory items</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Customer *</Label>
                  <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger data-testid="select-customer">
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer: any) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {customer.name} - {customer.phone}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCustomer && (
                  <div className="space-y-2">
                    <Label>Select Vehicle *</Label>
                    <Select value={selectedVehicleIndex} onValueChange={setSelectedVehicleIndex}>
                      <SelectTrigger data-testid="select-vehicle">
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCustomer.vehicles.map((vehicle: any, index: number) => (
                          <SelectItem key={index} value={index.toString()}>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              {vehicle.make} {vehicle.model} - {vehicle.plateNumber}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Service Notes</Label>
                  <Textarea
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="Describe the service to be performed..."
                    rows={4}
                    data-testid="input-service-notes"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Add Items from Inventory
                  </Label>
                  <div className="flex gap-2">
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger className="flex-1" data-testid="select-inventory-item">
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.filter((item: any) => item.quantity > 0).map((item: any) => (
                          <SelectItem key={item._id} value={item._id}>
                            {item.name} ({item.quantity} {item.unit} available) - ₹{item.price}/{item.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                      className="w-20"
                      placeholder="Qty"
                      data-testid="input-item-quantity"
                    />
                    <Button type="button" onClick={handleAddItem} variant="outline" data-testid="button-add-item">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Items</Label>
                    <div className="border rounded-lg divide-y">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x ₹{item.price} = ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(index)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      <div className="p-3 bg-accent/50">
                        <div className="flex justify-between font-bold">
                          <span>Total Cost:</span>
                          <span>₹{totalCost.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                type="submit"
                className="bg-primary"
                disabled={createJobMutation.isPending || !selectedCustomerId || !selectedVehicleIndex}
                data-testid="button-create-service"
              >
                {createJobMutation.isPending ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
