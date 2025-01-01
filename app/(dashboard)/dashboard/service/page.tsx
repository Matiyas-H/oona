//protected/dashboard/service/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Loader2, Phone, PhoneCall, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface UserNumber {
  telyxNumber: string;
}

interface AvailableService {
  id: string;
  serviceType: string;
  carrierId: string;
}

interface Service {
  id: string;
  isActive: boolean;
  gsmCode: string;
  lastDialed?: Date;
  carrier: { name: string };
  forwardingCode: {
    serviceType: string;
    activateFormat: string;
    deactivateFormat: string;
  };
  userNumber: UserNumber;
}

interface ServiceDialogProps {
  open: boolean;
  onClose: () => void;
  service: Service;
  onDial: (service: Service) => Promise<void>;
}

function ServiceDialog({ open, onClose, service, onDial }: ServiceDialogProps) {
  const [isDialing, setIsDialing] = useState(false);
  const isActivating = !service.isActive;

  const handleDial = async () => {
    setIsDialing(true);
    await onDial(service);
    setIsDialing(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-4 w-full max-w-[425px] overflow-hidden rounded-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">
            {isActivating ? "Activate" : "Deactivate"}{" "}
            {service.forwardingCode.serviceType}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isActivating
              ? "Dial the code to activate"
              : "Dial the code to deactivate."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-2 rounded-lg bg-muted p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            After dialing, Allow the call when prompted and wait for the
            confirmation message from your carrier.
          </p>
        </div>
        <DialogFooter className="mt-2 flex-row justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            variant={isActivating ? "default" : "destructive"}
            onClick={handleDial}
            disabled={isDialing}
            className="flex-1 sm:flex-none"
          >
            {isDialing ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <PhoneCall className="mr-2 size-4" />
            )}
            Dial Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ServiceCard({
  service,
  onServiceClick,
}: {
  service: Service;
  onServiceClick: (service: Service) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium leading-none">
                {service.forwardingCode.serviceType}
              </h3>
              <Badge
                variant={service.isActive ? "default" : "secondary"}
                className={`${service.isActive ? "bg-green-500" : ""} whitespace-nowrap`}
              >
                {service.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Carrier: {service.carrier.name}
            </p>
            {service.lastDialed && (
              <p className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="mr-1 size-3 shrink-0" />
                <span className="break-all">
                  Last dialed: {new Date(service.lastDialed).toLocaleString()}
                </span>
              </p>
            )}
          </div>
          <Button
            variant={service.isActive ? "destructive" : "default"}
            size="sm"
            onClick={() => onServiceClick(service)}
            className="w-full sm:w-auto"
          >
            <PhoneCall className="mr-2 size-4" />
            {service.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [availableServices, setAvailableServices] = useState<
    AvailableService[]
  >([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/user/services", {
        // cache: "no-store",
        next: { revalidate: 86400 },
      });
      const data = await response.json();
      if (data.data) {
        setServices(data.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch services",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const fetchAvailableServices = async () => {
    try {
      const response = await fetch("/api/user/services?available=true");
      const data = await response.json();
      if (data.success) {
        setAvailableServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching available services:", error);
    }
  };

  const handleAddService = async () => {
    try {
      const response = await fetch("/api/user/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: selectedServiceType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setServices([...services, data.data]);
        setShowAddDialog(false);
        toast({
          title: "Success",
          description: "Service added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add service",
      });
    }
  };

  const handleDial = async (service: Service) => {
    try {
      console.log("Service data:", {
        gsmCode: service.gsmCode,
        activateFormat: service.forwardingCode.activateFormat,
        deactivateFormat: service.forwardingCode.deactivateFormat,
      });
      // Generate the code based on current state
      // const code = service.isActive
      //   ? service.forwardingCode.deactivateFormat.replace(
      //       "{telynex_number}",
      //       service.gsmCode,
      //     )
      //   : service.forwardingCode.activateFormat.replace(
      //       "{telynex_number}",
      //       service.gsmCode,
      //     );
      // const formattedTelynx = service.userNumber.telyxNumber.replace(/^\+/, "");
      const telynxNumber = service.userNumber.telyxNumber;
      const formattedTelynx = telynxNumber
        .replace(/^\+?358/, "0") // Replace +358 or 358 with 0
        .replace(/\s+/g, "");
      const code = service.isActive
        ? service.forwardingCode.deactivateFormat
        : service.forwardingCode.activateFormat.replace(
            "{telynex_number}",
            formattedTelynx,
          );
      console.log("Generated code:", code);

      // Log the GSM code and telynx number
      console.log("GSM Code:", service.gsmCode);
      console.log("Telynx Number:", service.userNumber.telyxNumber);

      // Update the service state in the backend
      const response = await fetch(`/api/user/services/${service.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !service.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      // Update local state
      setServices(
        services.map((s) =>
          s.id === service.id
            ? { ...s, isActive: !s.isActive, lastDialed: new Date() }
            : s,
        ),
      );

      // Show success toast
      toast({
        title: "Ready to dial",
        description: "Redirecting to your phone dialer...",
      });

      // Initiate the call
      window.location.href = `tel:${code}`;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service state",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center pt-6">
            <Loader2 className="size-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>No Services Found</CardTitle>
            <CardDescription>
              You need to verify your phone number first to set up services.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-6 pt-4">
            <p className="text-center text-sm text-muted-foreground">
              To start using our services, please verify your phone number.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/verify")}
              className="w-full sm:w-auto"
            >
              <Phone className="mr-2 size-4" />
              Verify Phone Number
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const telyxNumber = services[0]?.userNumber.telyxNumber;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="size-5" />
              <span>Call Forwarding Services</span>
            </CardTitle>
            <Button
              onClick={() => {
                fetchAvailableServices();
                setShowAddDialog(true);
              }}
              variant="outline"
              className="w-full sm:w-auto"
              size="sm"
            >
              <Plus className="mr-2 size-4" />
              Add Service
            </Button>
          </div>
          {telyxNumber && (
            <CardDescription className="flex flex-col gap-1 sm:flex-row sm:items-center">
              <span className="shrink-0">Your Service Number:</span>
              <span className="break-all font-mono font-medium">
                {telyxNumber}
              </span>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onServiceClick={setSelectedService}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="mx-4 w-full rounded-sm sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Select a service type to add to your forwarding services.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedServiceType}
            onValueChange={setSelectedServiceType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a service type" />
            </SelectTrigger>
            <SelectContent>
              {availableServices.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.serviceType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={!selectedServiceType}>
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      {selectedService && (
        <ServiceDialog
          open={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onDial={handleDial}
        />
      )}
    </div>
  );
}
