"use client";

import { useState, useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Clock, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { submitLead } from "@/app/actions/leads";

function ContactForm() {
  const searchParams = useSearchParams();
  const propertyTitle = searchParams.get("property") || "";
  const propertyId = searchParams.get("property_id") || "";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formDataState, setFormDataState] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    notes: propertyTitle ? `Inquiring regarding property: ${propertyTitle}` : "",
    viewing_preference: "Weekends",
  });
  const [stepError, setStepError] = useState("");

  // @ts-ignore
  const [state, formAction] = useActionState(submitLead, null);

  const handleStep1Next = () => {
    if (!formDataState.name.trim() || formDataState.name.trim().length < 2) {
      setStepError("Please enter your name (minimum 2 characters).");
      return;
    }
    if (!formDataState.email.trim() || !formDataState.email.includes("@")) {
      setStepError("Please enter a valid email address.");
      return;
    }
    if (!formDataState.phone.trim() || formDataState.phone.trim().length < 8) {
      setStepError("Please enter a valid phone number.");
      return;
    }
    setStepError("");
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!formDataState.budget) {
      setStepError("Please select an estimated budget.");
      return;
    }
    setStepError("");
    setStep(3);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm flex flex-col h-fit">
      {propertyTitle && (
        <div className="mb-6 p-3 bg-primary/10 border border-primary/25 rounded-lg flex items-center gap-2.5 text-xs text-primary font-medium">
          <Building2 className="w-4 h-4 shrink-0" />
          <div className="truncate">
            Asset: <strong className="text-foreground">{propertyTitle}</strong>
          </div>
        </div>
      )}

      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">
        Direct Enquiry
      </p>
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Speak to the sales desk
      </h2>
      
      {state?.success ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Enquiry Successfully Submitted!</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your inquiry has been routed to our deals desk. An assigned manager will follow up with you shortly.
          </p>
          <button 
            type="button"
            onClick={() => { setStep(1); window.location.href = "/contact"; }} 
            className="mt-6 text-primary hover:underline text-sm font-semibold"
          >
            Submit another enquiry &rarr;
          </button>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-1.5">1. Contact</p>
            </div>
            <div className="flex-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-1.5">2. Budget</p>
            </div>
            <div className="flex-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              <p className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase mt-1.5">3. Viewing</p>
            </div>
          </div>

          {stepError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{stepError}</span>
            </div>
          )}

          {state?.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction as unknown as string}>
            {/* Hidden fields for Property ID & Name */}
            <input type="hidden" name="property_id" value={propertyId} />
            <input type="hidden" name="property_name" value={propertyTitle} />

            {/* Step 1: Contact Info */}
            <div className={step === 1 ? "flex flex-col space-y-3.5 animate-in fade-in" : "hidden"}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Your Full Name</label>
                <input 
                  name="name" 
                  type="text" 
                  value={formDataState.name}
                  onChange={(e) => setFormDataState({ ...formDataState, name: e.target.value })}
                  placeholder="e.g. Ramesh Reddy" 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  value={formDataState.email}
                  onChange={(e) => setFormDataState({ ...formDataState, email: e.target.value })}
                  placeholder="name@domain.com" 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Phone Number</label>
                <input 
                  name="phone" 
                  type="tel" 
                  value={formDataState.phone}
                  onChange={(e) => setFormDataState({ ...formDataState, phone: e.target.value })}
                  placeholder="+91 98765 43210" 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
                />
              </div>

              <button 
                type="button" 
                onClick={handleStep1Next} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg mt-2 transition-colors shadow-sm"
              >
                Continue to Budget &rarr;
              </button>
            </div>

            {/* Step 2: Budget & Requirements */}
            <div className={step === 2 ? "flex flex-col space-y-3.5 animate-in fade-in" : "hidden"}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Estimated Budget (INR ₹)</label>
                <select 
                  name="budget" 
                  value={formDataState.budget} 
                  onChange={(e) => setFormDataState({ ...formDataState, budget: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="" disabled>Select target budget range...</option>
                  <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                  <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                  <option value="₹1 Crore - ₹2.5 Crores">₹1 Crore - ₹2.5 Crores</option>
                  <option value="₹2.5 Crores+">₹2.5 Crores+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Specific Requirements or Questions</label>
                <textarea 
                  name="notes" 
                  rows={4} 
                  value={formDataState.notes}
                  onChange={(e) => setFormDataState({ ...formDataState, notes: e.target.value })}
                  placeholder="Tell us about your plot size preferences, location criteria, or questions..." 
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary resize-none transition-colors" 
                />
              </div>

              <div className="flex space-x-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setStepError(""); setStep(1); }} 
                  className="bg-background border border-border hover:bg-muted text-foreground font-medium py-3 px-5 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={handleStep2Next} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors shadow-sm"
                >
                  Continue to Viewing &rarr;
                </button>
              </div>
            </div>

            {/* Step 3: Viewing Availability & Submit */}
            <div className={step === 3 ? "flex flex-col space-y-3.5 animate-in fade-in" : "hidden"}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Preferred Site Viewing Time</label>
                <select 
                  name="viewing_preference" 
                  value={formDataState.viewing_preference}
                  onChange={(e) => setFormDataState({ ...formDataState, viewing_preference: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="Weekdays (Morning)">Weekdays (Morning)</option>
                  <option value="Weekdays (Afternoon)">Weekdays (Afternoon)</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Just browsing for now">Just browsing for now</option>
                </select>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground space-y-1">
                <p><strong>Name:</strong> {formDataState.name}</p>
                <p><strong>Contact:</strong> {formDataState.email} | {formDataState.phone}</p>
                <p><strong>Budget:</strong> {formDataState.budget}</p>
              </div>

              <div className="flex space-x-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setStepError(""); setStep(2); }} 
                  className="bg-background border border-border hover:bg-muted text-foreground font-medium py-3 px-5 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-colors shadow-md shadow-primary/20"
                >
                  Submit Enquiry
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      <p className="text-[11px] text-muted-foreground mt-6 text-center border-t border-border pt-3">
        All enquiries are handled directly by AcreDesk. We never share your personal information.
      </p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Sales Desk
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              One desk, every deal.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Viewings, title checks, zoning questions and offers all run through our in-house team. Send an enquiry and a named manager will own it end to end.
            </p>
          </div>

          <div className="flex flex-col space-y-5 pt-6 border-t border-border">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-primary mr-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-foreground">1acredesk@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-primary mr-4 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Hours</p>
                <p className="font-medium text-foreground">Mon–Sat, 8:00 – 19:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <Suspense fallback={
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            Loading enquiry form...
          </div>
        }>
          <ContactForm />
        </Suspense>
      </div>
    </main>
  );
}
