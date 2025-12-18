import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Car, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

const REFERRAL_SOURCES = [
  "Google Search",
  "Social Media",
  "Friend/Family",
  "Advertisement",
  "Walk-in",
  "Other",
];

const CUSTOMER_STATUSES = [
  { value: "Inquired", label: "Inquired" },
  { value: "Working", label: "Working" },
  { value: "Waiting", label: "Waiting" },
  { value: "Completed", label: "Completed" },
];

const VEHICLE_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Luxury",
  "Sports",
  "Other",
];

const PPF_PACKAGES = [
  // Elite
  "Elite - Small Cars - TPU 5Y (Gloss) - ₹55,000",
  "Elite - Small Cars - TPU 5Y (Matt) - ₹60,000",
  "Elite - Small Cars - TPU 7Y (Gloss) - ₹70,000",
  "Elite - Small Cars - TPU 8Y (Gloss) - ₹80,000",
  "Elite - Small Cars - TPU 10Y (Gloss) - ₹95,000",
  "Elite - Hatchback/Small Sedan - TPU 5Y (Gloss) - ₹60,000",
  "Elite - Hatchback/Small Sedan - TPU 5Y (Matt) - ₹65,000",
  "Elite - Hatchback/Small Sedan - TPU 7Y (Gloss) - ₹75,000",
  "Elite - Hatchback/Small Sedan - TPU 8Y (Gloss) - ₹85,000",
  "Elite - Hatchback/Small Sedan - TPU 10Y (Gloss) - ₹1,05,000",
  "Elite - Mid-size Sedan/Compact SUV/MUV - TPU 5Y (Gloss) - ₹70,000",
  "Elite - Mid-size Sedan/Compact SUV/MUV - TPU 5Y (Matt) - ₹75,000",
  "Elite - Mid-size Sedan/Compact SUV/MUV - TPU 7Y (Gloss) - ₹90,000",
  "Elite - Mid-size Sedan/Compact SUV/MUV - TPU 8Y (Gloss) - ₹95,000",
  "Elite - Mid-size Sedan/Compact SUV/MUV - TPU 10Y (Gloss) - ₹1,12,500",
  "Elite - SUV/MPV - TPU 5Y (Gloss) - ₹80,000",
  "Elite - SUV/MPV - TPU 5Y (Matt) - ₹85,000",
  "Elite - SUV/MPV - TPU 7Y (Gloss) - ₹95,000",
  "Elite - SUV/MPV - TPU 8Y (Gloss) - ₹1,05,000",
  "Elite - SUV/MPV - TPU 10Y (Gloss) - ₹1,20,000",
  // Garware P
  "Garware P - Small Cars - ₹62,000",
  "Garware P - Hatchback/Small Sedan - ₹65,000",
  "Garware P - Mid-size Sedan/Compact SUV/MUV - ₹70,000",
  "Garware P - SUV/MPV - ₹85,000",
  "Garware P - Small Cars - 10Y - ₹80,000",
  "Garware P - Hatchback/Small Sedan - 10Y - ₹85,000",
  "Garware P - Mid-size Sedan/Compact SUV/MUV - 10Y - ₹90,000",
  "Garware P - SUV/MPV - 10Y - ₹95,000",
  // Garware N
  "Garware N - Small Cars - 7Y - ₹1,05,000",
  "Garware N - Hatchback/Small Sedan - 7Y - ₹1,10,000",
  "Garware N - Mid-size Sedan/Compact SUV/MUV - 7Y - ₹1,15,000",
  "Garware N - SUV/MPV - 7Y - ₹1,20,000",
];

const SERVICE_OPTIONS = {
  ppf: {
    label: "PPF Services",
    options: PPF_PACKAGES,
  },
  services: {
    label: "Other Services",
    options: [
      "Foam Washing",
      "Premium Washing",
      "Interior Cleaning",
      "Interior Steam Cleaning",
      "Leather Treatment",
      "Detailing",
      "Paint Protection",
      "Ceramic Coating",
      "Denting & Painting",
    ],
  },
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validateEmail = (email: string): boolean => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function CustomerRegistration() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  // Customer info
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    state: "Maharashtra",
    referralSource: "",
    status: "Inquired",
    service: "",
  });

  // Vehicle info
  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    plateNumber: "",
    chassisNumber: "",
    color: "",
    vehicleType: "",
  });

  const createCustomerMutation = useMutation({
    mutationFn: api.customers.create,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer registered successfully!" });
      setLocation("/funnel");
    },
    onError: () => {
      toast({ title: "Failed to register customer", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    createCustomerMutation.mutate({
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || undefined,
      address: `${customerData.address}, ${customerData.city}, ${customerData.district}, ${customerData.state}`,
      status: customerData.status,
      service: customerData.service || undefined,
      vehicles: [
        {
          make: vehicleData.make,
          model: vehicleData.model,
          year: vehicleData.year,
          plateNumber: vehicleData.plateNumber,
          color: vehicleData.color,
          vin: vehicleData.chassisNumber,
        },
      ],
    });
  };

  const validateStep1 = () => {
    const newErrors: { phone?: string; email?: string } = {};
    
    if (!validatePhone(customerData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number";
    }
    
    if (!validateEmail(customerData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const canProceedStep1 = customerData.name && customerData.phone;
  const canProceedStep2 =
    vehicleData.make && vehicleData.model && vehicleData.plateNumber;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-3">
          <h1
            className="font-display text-xl font-bold tracking-tight"
            data-testid="text-registration-title"
          >
            Customer Registration
          </h1>
        </div>

        {/* Step 1: Customer Information */}
        {step === 1 && (
          <Card
            className="border-orange-200 dark:border-orange-800"
            data-testid="card-customer-info"
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4 text-blue-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={customerData.name}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    data-testid="input-full-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input
                    value={customerData.phone}
                    onChange={(e) => {
                      setCustomerData({
                        ...customerData,
                        phone: e.target.value,
                      });
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="10-digit mobile number"
                    data-testid="input-mobile"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Alternative Number (Optional)</Label>
                  <Input
                    value={customerData.alternatePhone}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        alternatePhone: e.target.value,
                      })
                    }
                    placeholder="10-digit mobile number (Optional)"
                    data-testid="input-alt-mobile"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => {
                      setCustomerData({
                        ...customerData,
                        email: e.target.value,
                      });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="your@email.com (optional)"
                    data-testid="input-email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label>How did you hear about us?</Label>
                  <Select
                    value={customerData.referralSource}
                    onValueChange={(value) =>
                      setCustomerData({
                        ...customerData,
                        referralSource: value,
                      })
                    }
                  >
                    <SelectTrigger data-testid="select-referral">
                      <SelectValue placeholder="Select referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      {REFERRAL_SOURCES.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Customer Status</Label>
                  <Select
                    value={customerData.status}
                    onValueChange={(value) =>
                      setCustomerData({
                        ...customerData,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUSTOMER_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Service Required *</Label>
                  <Select
                    value={customerData.service}
                    onValueChange={(value) =>
                      setCustomerData({
                        ...customerData,
                        service: value,
                      })
                    }
                  >
                    <SelectTrigger data-testid="select-service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-sm font-semibold text-blue-600">— {SERVICE_OPTIONS.ppf.label} —</div>
                      {SERVICE_OPTIONS.ppf.options.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-sm font-semibold text-green-600 mt-2">— {SERVICE_OPTIONS.services.label} —</div>
                      {SERVICE_OPTIONS.services.options.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={customerData.address}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        address: e.target.value,
                      })
                    }
                    placeholder="Street address"
                    data-testid="input-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={customerData.city}
                    onChange={(e) =>
                      setCustomerData({ ...customerData, city: e.target.value })
                    }
                    placeholder="City"
                    data-testid="input-city"
                  />
                </div>

                <div className="space-y-2">
                  <Label>District</Label>
                  <Input
                    value={customerData.district}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        district: e.target.value,
                      })
                    }
                    placeholder="District"
                    data-testid="input-district"
                  />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={customerData.state}
                    onChange={(e) =>
                      setCustomerData({
                        ...customerData,
                        state: e.target.value,
                      })
                    }
                    placeholder="State"
                    data-testid="input-state"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceedStep1}
                  className="bg-blue-500 hover:bg-blue-600"
                  data-testid="button-next-step"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Vehicle Details */}
        {step === 2 && (
          <Card
            className="border-orange-200 dark:border-orange-800"
            data-testid="card-vehicle-info"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-500" />
                Vehicle Details
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Please provide your vehicle information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle Make *</Label>
                  <Input
                    value={vehicleData.make}
                    onChange={(e) =>
                      setVehicleData({ ...vehicleData, make: e.target.value })
                    }
                    placeholder="e.g., Toyota, BMW"
                    data-testid="input-vehicle-make"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Model *</Label>
                  <Input
                    value={vehicleData.model}
                    onChange={(e) =>
                      setVehicleData({ ...vehicleData, model: e.target.value })
                    }
                    placeholder="e.g., Fortuner, 3 Series"
                    data-testid="input-vehicle-model"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select
                    value={vehicleData.vehicleType}
                    onValueChange={(value) =>
                      setVehicleData({ ...vehicleData, vehicleType: value })
                    }
                  >
                    <SelectTrigger data-testid="select-vehicle-type">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEHICLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Year of Manufacture</Label>
                  <Input
                    value={vehicleData.year}
                    onChange={(e) =>
                      setVehicleData({ ...vehicleData, year: e.target.value })
                    }
                    placeholder="e.g., 2023"
                    data-testid="input-vehicle-year"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vehicle Number *</Label>
                  <Input
                    value={vehicleData.plateNumber}
                    onChange={(e) =>
                      setVehicleData({
                        ...vehicleData,
                        plateNumber: e.target.value,
                      })
                    }
                    placeholder="e.g., MH02 AB 1234"
                    data-testid="input-plate-number"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chassis Number</Label>
                  <Input
                    value={vehicleData.chassisNumber}
                    onChange={(e) =>
                      setVehicleData({
                        ...vehicleData,
                        chassisNumber: e.target.value,
                      })
                    }
                    placeholder="Vehicle chassis number"
                    data-testid="input-chassis"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    value={vehicleData.color}
                    onChange={(e) =>
                      setVehicleData({ ...vehicleData, color: e.target.value })
                    }
                    placeholder="e.g., White, Black"
                    data-testid="input-color"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  data-testid="button-prev-step"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !canProceedStep2 || createCustomerMutation.isPending
                  }
                  className="bg-green-500 hover:bg-green-600"
                  data-testid="button-submit-registration"
                >
                  {createCustomerMutation.isPending
                    ? "Registering..."
                    : "Complete Registration"}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
