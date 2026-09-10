"use client";

import { useState, useActionState } from "react";
import { Mail, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { submitLead } from "@/app/actions/leads";

export default function ContactPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // @ts-ignore
  const [state, formAction] = useActionState(submitLead, null);

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left Column */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-4">
              Sales Desk
            </p>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              One desk, every deal.
            </h1>
            <p className="text-lg text-muted-foreground">
              Viewings, title checks, zoning questions and offers all run through our in-house team. Send an enquiry and a named manager will own it end to end.
            </p>
          </div>

          <div className="flex flex-col space-y-6 pt-6 border-t border-border/50">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-primary mr-4 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Email</p>
                <p className="font-semibold text-white">1acredesk@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-primary mr-4 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Hours</p>
                <p className="font-semibold">Mon–Sat, 8:00 – 19:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm flex flex-col h-fit">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">
            Enquire Now
          </p>
          <h2 className="text-2xl font-bold mb-8">
            Speak to the sales desk
          </h2>
          
          {state?.success ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                 <Mail className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Enquiry Sent!</h3>
               <p className="text-muted-foreground">A dealer has been assigned to your case and will reach out shortly.</p>
               <button onClick={() => { setStep(1); window.location.reload(); }} className="mt-6 text-primary hover:underline text-sm font-medium">Submit another enquiry</button>
             </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="flex items-center space-x-2 mb-8">
                <div className="flex-1">
                  <div className={`h-1 w-full rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-2">Contact</p>
                </div>
                <div className="flex-1">
                  <div className={`h-1 w-full rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-2">Budget</p>
                </div>
                <div className="flex-1">
                  <div className={`h-1 w-full rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                  <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-2">Viewing</p>
                </div>
              </div>

              {/* Multistep Form */}
              <form action={formAction as unknown as string}>
                <div className={step === 1 ? "flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4" : "hidden"}>
                  <input name="name" type="text" required placeholder="Your name" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" />
                  <input name="email" type="email" required placeholder="Email address" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" />
                  <input name="phone" type="tel" required placeholder="Phone number" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary" />
                  <button type="button" onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded mt-4 transition-colors">
                    Continue
                  </button>
                </div>

                <div className={step === 2 ? "flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4" : "hidden"}>
                  <select name="budget" required defaultValue="" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary">
                    <option value="" disabled>Select a budget in INR (₹)...</option>
                    <option>₹25 Lakhs - ₹50 Lakhs</option>
                    <option>₹50 Lakhs - ₹1 Crore</option>
                    <option>₹1 Crore - ₹2.5 Crores</option>
                    <option>₹2.5 Crores+</option>
                  </select>
                  <textarea name="notes" rows={4} placeholder="Anything we should know about your requirements?" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary resize-none" />
                  <div className="flex space-x-3 mt-4">
                    <button type="button" onClick={() => setStep(1)} className="bg-background border border-border hover:bg-muted text-foreground font-medium py-3 px-6 rounded transition-colors">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded transition-colors">Continue</button>
                  </div>
                </div>

                <div className={step === 3 ? "flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4" : "hidden"}>
                  <select name="viewing_preference" required defaultValue="" className="bg-background border border-border rounded p-3 text-sm focus:outline-none focus:border-primary">
                    <option value="" disabled>Viewing availability...</option>
                    <option>Weekdays (Morning)</option>
                    <option>Weekdays (Afternoon)</option>
                    <option>Weekends</option>
                    <option>Just browsing for now</option>
                  </select>
                  {state?.error && <p className="text-red-500 text-sm mt-2 font-medium text-center">{state.error}</p>}
                  <div className="flex space-x-3 mt-4">
                    <button type="button" onClick={() => setStep(2)} className="bg-background border border-border hover:bg-muted text-foreground font-medium py-3 px-6 rounded transition-colors">Back</button>
                    <button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded transition-colors">Send enquiry</button>
                  </div>
                </div>
              </form>
            </>
          )}

          <p className="text-xs text-muted-foreground mt-8 text-center border-t border-border pt-4">
            All enquiries are handled directly by AcreDesk. We never share owner details.
          </p>
        </div>
      </div>
    </main>
  );
}
