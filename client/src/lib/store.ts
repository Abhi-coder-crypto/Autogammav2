import { create } from 'zustand';

export type JobStage = 'New Lead' | 'Inspection Done' | 'Work In Progress' | 'Ready for Delivery' | 'Completed' | 'Cancelled';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  color: string;
  vin?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  vehicles: Vehicle[];
}

export interface ServiceItem {
  id: string;
  description: string;
  cost: number;
  type: 'part' | 'labor';
}

export interface Job {
  id: string;
  customerId: string;
  vehicleId: string;
  stage: JobStage;
  technicianId?: string;
  notes: string;
  serviceItems: ServiceItem[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid';
  createdAt: string;
  updatedAt: string;
  customerName: string; // Denormalized for easy access
  vehicleName: string; // Denormalized for easy access
  plateNumber: string; // Denormalized
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  status: 'Available' | 'Busy' | 'Off';
  currentJobs: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'PPF' | 'Ceramic' | 'Tools' | 'Parts' | 'Chemicals';
  quantity: number;
  unit: string;
  minStock: number;
  price: number;
}

// Mock Data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    vehicles: [
      { id: 'v1', make: 'Toyota', model: 'Fortuner', year: '2022', plateNumber: 'MH02 AB 1234', color: 'White' },
      { id: 'v2', make: 'Honda', model: 'City', year: '2020', plateNumber: 'MH02 XY 9876', color: 'Silver' }
    ]
  },
  {
    id: 'c2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    vehicles: [
      { id: 'v3', make: 'Hyundai', model: 'Creta', year: '2023', plateNumber: 'GJ01 CD 4567', color: 'Black' }
    ]
  },
  {
    id: 'c3',
    name: 'Amit Singh',
    phone: '+91 76543 21098',
    vehicles: [
      { id: 'v4', make: 'Mahindra', model: 'Thar', year: '2021', plateNumber: 'DL08 EF 5555', color: 'Red' }
    ]
  }
];

const MOCK_TECHNICIANS: Technician[] = [
  { id: 't1', name: 'Vikram', specialty: 'General Mechanic', status: 'Busy', currentJobs: 2 },
  { id: 't2', name: 'Suresh', specialty: 'Detailing Expert', status: 'Available', currentJobs: 0 },
  { id: 't3', name: 'John', specialty: 'Electrician', status: 'Busy', currentJobs: 1 },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: '3M PPF Roll', category: 'PPF', quantity: 15, unit: 'meters', minStock: 10, price: 2500 },
  { id: 'i2', name: 'Ceramic Pro 9H', category: 'Ceramic', quantity: 5, unit: 'kits', minStock: 2, price: 15000 },
  { id: 'i3', name: 'Microfiber Towels', category: 'Tools', quantity: 50, unit: 'pcs', minStock: 20, price: 100 },
  { id: 'i4', name: 'Engine Oil 5W40', category: 'Chemicals', quantity: 20, unit: 'liters', minStock: 10, price: 800 },
];

const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    customerId: 'c1',
    vehicleId: 'v1',
    customerName: 'Rahul Sharma',
    vehicleName: 'Toyota Fortuner',
    plateNumber: 'MH02 AB 1234',
    stage: 'Work In Progress',
    technicianId: 't1',
    notes: 'Full service + PPF on bonnet',
    serviceItems: [
      { id: 's1', description: 'General Service', cost: 5000, type: 'labor' },
      { id: 's2', description: 'Engine Oil', cost: 3200, type: 'part' },
      { id: 's3', description: 'PPF Bonnet', cost: 15000, type: 'part' }
    ],
    totalAmount: 23200,
    paidAmount: 5000,
    paymentStatus: 'Partially Paid',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'j2',
    customerId: 'c2',
    vehicleId: 'v3',
    customerName: 'Priya Patel',
    vehicleName: 'Hyundai Creta',
    plateNumber: 'GJ01 CD 4567',
    stage: 'New Lead',
    technicianId: undefined,
    notes: 'Inquiry for Ceramic Coating',
    serviceItems: [],
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'j3',
    customerId: 'c3',
    vehicleId: 'v4',
    customerName: 'Amit Singh',
    vehicleName: 'Mahindra Thar',
    plateNumber: 'DL08 EF 5555',
    stage: 'Ready for Delivery',
    technicianId: 't2',
    notes: 'Interior detailing completed',
    serviceItems: [
      { id: 's4', description: 'Interior Detailing', cost: 4500, type: 'labor' }
    ],
    totalAmount: 4500,
    paidAmount: 4500,
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface AppState {
  jobs: Job[];
  customers: Customer[];
  technicians: Technician[];
  inventory: InventoryItem[];
  addJob: (job: Job) => void;
  updateJobStage: (jobId: string, stage: JobStage) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  addCustomer: (customer: Customer) => void;
}

export const useStore = create<AppState>((set) => ({
  jobs: MOCK_JOBS,
  customers: MOCK_CUSTOMERS,
  technicians: MOCK_TECHNICIANS,
  inventory: MOCK_INVENTORY,
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJobStage: (jobId, stage) => set((state) => ({
    jobs: state.jobs.map((j) => j.id === jobId ? { ...j, stage, updatedAt: new Date().toISOString() } : j)
  })),
  updateJob: (jobId, updates) => set((state) => ({
    jobs: state.jobs.map((j) => j.id === jobId ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j)
  })),
  addCustomer: (customer) => set((state) => ({ customers: [...state.customers, customer] })),
}));
