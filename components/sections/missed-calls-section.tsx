/* eslint-disable tailwindcss/classnames-order */
import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "../shared/icons";
import { cn } from "@/lib/utils";
import { PhoneCall, Globe, Zap, Headphones, MessageSquare, TrendingUp } from "lucide-react";

export function MissedCallsSection() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16 dark:from-slate-900 dark:to-slate-800 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Left column with text content */}
          <div className="mb-10 lg:mb-0">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[40px]">
              Tired of Missed Calls and Overwhelmed Teams?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Your customers still call. But your team can't scale to meet demand—and legacy voice bots just frustrate people.
            </p>
            <p className="mt-2 text-lg text-foreground font-semibold">
              Omnia fixes that.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              With real-time, human-sounding voice agents working out of the box, Omnia helps you instantly serve every caller in 25+ languages, with no manual effort.
            </p>
            
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: "search",
                  title: "Never Miss a Call",
                  description: "Answer 100% of calls 24/7 with AI voice agents that sound natural and understand context"
                },
                {
                  icon: "laptop",
                  title: "Speak 25+ Languages",
                  description: "Serve international customers in their native language without hiring multilingual staff"
                },
                {
                  icon: "sparkles",
                  title: "Instant Deployment",
                  description: "Get up and running in minutes with pre-built voice agents that work right away"
                }
              ].map((feature, index) => {
                const Icon = Icons[feature.icon];
                return (
                  <div key={index} className="flex items-start">
                    <div className="shrink-0">
                      <div className="flex size-12 items-center justify-center rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        <Icon className="size-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                Start Serving Every Caller
              </Button>
            </div>
          </div>
          
          {/* Right column with illustration */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl border shadow-lg bg-background">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-30"></div>
              <div className="p-8 relative">
                <div className="mb-6 flex items-center justify-center space-x-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Headphones className="size-8 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Omnia Voice Agent</h3>
                    <p className="text-sm text-muted-foreground">Always available, always helpful</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center mb-2">
                      <PhoneCall className="mr-2 size-4 text-green-500" />
                      <span className="text-sm font-medium">Incoming call</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Omnia answers immediately, no waiting</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="mr-2 size-4 text-blue-500" />
                      <span className="text-sm font-medium">Natural conversation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Human-like interactions that understand context</p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center mb-2">
                      <Icons.check className="mr-2 size-4 text-green-500" />
                      <span className="text-sm font-medium">Issue resolved</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Customer needs addressed without human intervention</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <div className="flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                    <TrendingUp className="mr-2 size-4" />
                    <span>100% Call Answer Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
