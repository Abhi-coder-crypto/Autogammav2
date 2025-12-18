import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Car, Mail, DollarSign, Wrench, ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDetails() {
  const [match, params] = useRoute("/customer-details/:id");
  const customerId = params?.id;
  const { toast } = useToast();

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.customers.list(),
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => api.jobs.list(),
  });

  const customer = customers.find((c: any) => c._id === customerId);
  const jobHistory = jobs.filter((job: any) => job.customerId === customerId);

  if (!customer) {
    return (
      <div className="space-y-4">
        <Link href="/registered-customers">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </Link>
        <div className="text-center py-12 text-muted-foreground">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/registered-customers">
            <Button variant="outline" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Info */}
      <Card className="border border-amber-200 dark:border-amber-800" data-testid={`customer-details-${customerId}`}>
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-display text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground mt-1">Customer Details</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Vehicles */}
          {customer.vehicles && customer.vehicles.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Vehicles</h2>
              <div className="space-y-2">
                {customer.vehicles.map((vehicle: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {vehicle.make} {vehicle.model}
                          {vehicle.year && <span className="text-muted-foreground text-sm"> ({vehicle.year})</span>}
                        </p>
                        {vehicle.color && <p className="text-xs text-muted-foreground">Color: {vehicle.color}</p>}
                      </div>
                    </div>
                    {vehicle.plateNumber && (
                      <span className="text-sm font-medium bg-background px-3 py-1 rounded border">{vehicle.plateNumber}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Information */}
          {customer.service && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Service Details</h2>
              <div className="p-4 bg-accent/20 rounded-lg border space-y-2">
                <p className="text-sm">{customer.service}</p>
                {customer.serviceCost && (
                  <div className="flex items-center gap-2 font-semibold text-lg">
                    <DollarSign className="w-5 h-5" />
                    ₹{customer.serviceCost.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Service History */}
          {jobHistory.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Service History ({jobHistory.length})</h2>
              <div className="space-y-2">
                {jobHistory.map((job: any) => (
                  <div key={job._id} className="p-4 bg-accent/10 rounded-lg border">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="font-medium">{job.vehicleName}</p>
                      <span className="text-xs font-medium bg-background px-2 py-1 rounded border">{job.stage}</span>
                    </div>
                    {job.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    )}
                    {job.totalAmount && (
                      <p className="text-sm font-medium mt-1">Amount: ₹{job.totalAmount.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link href={`/customer-service?customerId=${customer._id}`}>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" data-testid={`button-create-service-${customer._id}`}>
              <Wrench className="w-4 h-4 mr-2" />
              Create New Service
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
