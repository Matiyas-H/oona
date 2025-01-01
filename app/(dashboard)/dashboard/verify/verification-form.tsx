"use client";

// app/protected/dashboard/verify/verification-form.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Carrier, Country } from "@prisma/client";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema and types
const verificationFormSchema = z.object({
  countryId: z.string({
    required_error: "Please select a country",
  }),
  carrierId: z.string({
    required_error: "Please select a carrier",
  }),
  phoneNumber: z.string().min(9, {
    message: "Phone number must be at least 10 digits",
  }),
});

type VerificationFormValues = z.infer<typeof verificationFormSchema>;

interface VerificationFormProps {
  countries: Country[];
  carriers: Carrier[];
}

export function VerificationForm({
  countries,
  carriers,
}: VerificationFormProps) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      countryId: "",
      carrierId: "",
      phoneNumber: "",
    },
  });

  const { watch } = form;
  const selectedCountryId = watch("countryId");
  const selectedCountry = countries.find(
    (country) => country.id === selectedCountryId,
  );
  const availableCarriers = carriers.filter(
    (carrier) => carrier.countryId === selectedCountryId,
  );

  const onSubmit = async (data: VerificationFormValues) => {
    try {
      setIsVerifying(true);
      setError(null); // Clear any previous errors

      const response = await fetch("/api/verify/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: data.phoneNumber,
          countryCode: selectedCountry?.code,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage: string;

        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || "Failed to start verification";
        } else {
          const errorText = await response.text();
          errorMessage = errorText || "Failed to start verification";
        }

        setError(errorMessage);
        return;
      }

      const responseData = await response.json();
      setShowVerificationInput(true);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // const verifyCode = async () => {
  //   try {
  //     setIsVerifying(true);
  //     setError(null);

  //     const response = await fetch("/api/verify/code", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         code: verificationCode,
  //         phoneNumber: form.getValues("phoneNumber"),
  //         countryCode: selectedCountry?.code,
  //         countryId: form.getValues("countryId"),
  //         carrierId: form.getValues("carrierId"),
  //       }),
  //     });

  //     const data = await response.text();
  //     if (!response.ok) {
  //       setError(`Verification failed: ${data}`);
  //       return;
  //     }

  //     try {
  //       const json = JSON.parse(data);
  //       setIsVerified(true);
  //       setShowVerificationInput(false);
  //       router.push("/dashboard/service");
  //     } catch (e) {
  //       setError(`Invalid response: ${data}`);
  //     }
  //   } catch (error) {
  //     setError(`Network error: ${error.message}`);
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const verifyCode = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      const response = await fetch("/api/verify/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verificationCode,
          phoneNumber: form.getValues("phoneNumber"),
          countryCode: selectedCountry?.code,
          countryId: form.getValues("countryId"),
          carrierId: form.getValues("carrierId"),
        }),
      });

      if (response.status === 403) {
        router.push("/dashboard/billing");
        return;
      }

      if (!response.ok) {
        const data = await response.text();
        setError(`Verification failed: ${data}`);
        return;
      }

      const json = await response.json();
      setIsVerified(true);
      setShowVerificationInput(false);
      router.push("/dashboard/service");
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select
                disabled={isVerifying}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carrierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrier</FormLabel>
              <Select
                disabled={!selectedCountryId || isVerifying}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a carrier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCarriers.map((carrier) => (
                    <SelectItem key={carrier.id} value={carrier.id}>
                      {carrier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="w-20">
                    <Input
                      disabled
                      value={selectedCountry?.code || ""}
                      placeholder="+1"
                    />
                  </div>
                  <Input
                    disabled={isVerifying || !selectedCountryId}
                    placeholder="Enter phone number"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showVerificationInput && (
          <FormItem>
            <FormLabel>Verification Code</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <Button
                  type="button"
                  onClick={verifyCode}
                  disabled={verificationCode.length !== 6 || isVerifying}
                >
                  {isVerifying ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}

        {!showVerificationInput && !isVerified && (
          <Button
            type="submit"
            disabled={isVerifying || !form.formState.isValid}
            className="w-full"
          >
            {isVerifying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Send Verification Code"
            )}
          </Button>
        )}

        {isVerified && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="size-4" />
            Phone number verified
          </div>
        )}
      </form>
    </Form>
  );
}
