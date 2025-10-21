"use client";

import React, { useState, useCallback } from 'react';
import { Phone } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PhoneFormModal } from './phone-form-modal';
import { useToast } from '@/components/ui/use-toast';

interface LiveKitVoiceProps {
  className?: string;
}

export function LiveKitVoice({ className }: LiveKitVoiceProps) {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = useCallback(async (phoneNumber: string) => {
    try {
      setShowPhoneModal(false);
      
      // Make the outbound call
      const response = await fetch('/api/calls/outbound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const data = await response.json();
      console.log('Call initiated:', data);
      
      // Show success message
      toast({
        title: "Agent Calling",
        description: "Our Omnia Voice agent is dialing you now—pick up to hear the platform in action.",
      });
      
    } catch (error) {
      console.error('Call failed:', error);
      toast({
        title: "Call Failed",
        description: "We couldn't trigger the agent call. Please check the number and try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <>
      <Button
        onClick={() => setShowPhoneModal(true)}
        className={cn(
          buttonVariants({ size: "sm" }),
          "flex justify-center gap-1 rounded-xl px-4 text-sm transition-transform duration-200 hover:scale-105",
          className
        )}
      >
        <Phone className="size-4" />
        <span>Let the Agent Call Me</span>
      </Button>
      
      <PhoneFormModal
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={handlePhoneSubmit}
      />
    </>
  );
}
