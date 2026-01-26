"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Finland",
  "Sweden",
  "Norway",
  "Denmark",
  "Netherlands",
  "Belgium",
  "Spain",
  "Italy",
  "Canada",
  "Australia",
  "Other",
];

const hearAboutUs = [
  "Google Search",
  "LinkedIn",
  "Twitter/X",
  "Referral",
  "Blog/Article",
  "Conference/Event",
  "Other",
];

const steps = [
  { id: 1, title: "Company" },
  { id: 2, title: "Contact" },
  { id: 3, title: "Details" },
];

export default function ContactPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    email: "",
    website: "",
    firstName: "",
    lastName: "",
    country: "",
    phone: "",
    useCase: "",
    message: "",
    hearAboutUs: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = formData.email && formData.website;
  const canProceedStep2 = formData.firstName && formData.lastName && formData.country;
  const canSubmit = formData.useCase && formData.message && formData.hearAboutUs;

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send");

      setSubmitted(true);
      toast({
        title: "Message sent",
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAFAF9] py-24 md:py-32">
      <div className="container max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-xs font-medium tracking-wide text-[#1a1a1a]/40">
            CONTACT US
          </span>
          <h1 className="mt-4 font-heading text-3xl text-[#1a1a1a] md:text-4xl lg:text-5xl">
            Talk to Sales
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[#1a1a1a]/60">
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12"
        >
          {submitted ? (
            <div className="border border-[#2D5A27]/20 bg-[#2D5A27]/5 p-8 text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#2D5A27]/10">
                <Send className="size-5 text-[#2D5A27]" />
              </div>
              <h3 className="font-heading text-xl text-[#1a1a1a]">
                Thanks for reaching out
              </h3>
              <p className="mt-2 text-sm text-[#1a1a1a]/60">
                We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <div className="border border-[#1a1a1a]/10 bg-white p-6 md:p-8">
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-8 items-center justify-center text-sm font-medium transition-colors ${
                            currentStep >= step.id
                              ? "bg-[#1a1a1a] text-white"
                              : "bg-[#1a1a1a]/10 text-[#1a1a1a]/40"
                          }`}
                        >
                          {step.id}
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium ${
                            currentStep >= step.id
                              ? "text-[#1a1a1a]"
                              : "text-[#1a1a1a]/40"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-4 h-px w-12 sm:w-20 md:w-24 ${
                            currentStep > step.id
                              ? "bg-[#1a1a1a]"
                              : "bg-[#1a1a1a]/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form steps */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="website"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        Company Website <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                        placeholder="https://company.com"
                      />
                    </div>

                    <button
                      onClick={nextStep}
                      disabled={!canProceedStep1}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#1a1a1a] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333] disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="size-4" />
                    </button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                        >
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/30 focus:outline-none"
                      >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        Phone Number{" "}
                        <span className="text-[#1a1a1a]/40">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={prevStep}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-[#1a1a1a]/20 bg-transparent px-8 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:bg-[#1a1a1a]/5"
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        disabled={!canProceedStep2}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[#1a1a1a] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333] disabled:opacity-50"
                      >
                        Continue
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="useCase"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        Use Case <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="useCase"
                        value={formData.useCase}
                        onChange={(e) => updateField("useCase", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                        placeholder="e.g., Customer support automation, appointment booking..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        How can we help? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        rows={4}
                        className="w-full resize-none border border-[#1a1a1a]/10 bg-white p-4 text-sm text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:border-[#1a1a1a]/30 focus:outline-none"
                        placeholder="Tell us about your project, expected call volume, or any questions..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="hearAboutUs"
                        className="mb-2 block text-sm font-medium text-[#1a1a1a]"
                      >
                        How did you hear about us?{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={(e) => updateField("hearAboutUs", e.target.value)}
                        className="h-12 w-full border border-[#1a1a1a]/10 bg-white px-4 text-sm text-[#1a1a1a] focus:border-[#1a1a1a]/30 focus:outline-none"
                      >
                        <option value="">Select an option</option>
                        {hearAboutUs.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={prevStep}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 border border-[#1a1a1a]/20 bg-transparent px-8 text-sm font-medium tracking-wide text-[#1a1a1a] transition-all hover:bg-[#1a1a1a]/5"
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[#1a1a1a] px-8 text-sm font-medium tracking-wide text-white transition-all hover:bg-[#333] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit
                            <Send className="size-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center text-sm text-[#1a1a1a]/50"
        >
          <p>
            Or email us directly at{" "}
            <a
              href="mailto:sales@omnia-voice.com"
              className="text-[#1a1a1a] underline underline-offset-2"
            >
              sales@omnia-voice.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
