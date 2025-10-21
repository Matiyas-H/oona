"use client";

import React, { useState } from 'react';
import { X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PhoneFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}

export function PhoneFormModal({ open, onClose, onSubmit }: PhoneFormModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit(phoneNumber);
    setIsSubmitting(false);
    setPhoneNumber('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="size-5" />
            Hear the Omnia Voice Agent
          </DialogTitle>
          <DialogDescription>
            Enter your number (with country code) and our AI voice agent will ring you in seconds.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="w-full"
              required
            />
            <p className="text-xs text-muted-foreground">
              Include your country code (e.g., +1 for US, +44 for UK). The call will start immediately.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !phoneNumber.trim()}
            >
              {isSubmitting ? "Connecting..." : "Call Me Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
