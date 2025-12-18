import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import ServiceFunnel from "@/pages/jobs";
import Customers from "@/pages/customers";
import CustomerRegistration from "@/pages/register";
import RegisteredCustomers from "@/pages/registered-customers";
import CustomerDetails from "@/pages/customer-details";
import CustomerService from "@/pages/customer-service";
import Technicians from "@/pages/technicians";
import Inventory from "@/pages/inventory";
import Appointments from "@/pages/appointments";
import Invoices from "@/pages/invoices";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/register" component={CustomerRegistration} />
        <Route path="/registered-customers" component={RegisteredCustomers} />
        <Route path="/customer-details/:id" component={CustomerDetails} />
        <Route path="/funnel" component={RegisteredCustomers} />
        <Route path="/customers" component={Customers} />
        <Route path="/customer-service" component={CustomerService} />
        <Route path="/jobs" component={ServiceFunnel} />
        <Route path="/technicians" component={Technicians} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
