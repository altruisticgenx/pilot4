import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { usePrefill } from "@/contexts/PrefillContext";

const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  organization: z.string().trim().max(200, "Organization must be less than 200 characters").optional(),
  role: z.string().min(1, "Please select a role"),
  project_description: z.string().trim().min(10, "Please provide at least 10 characters").max(2000, "Description must be less than 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prefill, clearPrefill } = usePrefill();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      organization: "",
      role: "",
      project_description: "",
    },
  });

  // Apply prefill data when it changes
  useEffect(() => {
    if (Object.keys(prefill).length > 0) {
      Object.entries(prefill).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof ContactFormValues, value);
        }
      });
    }
  }, [prefill, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("pilot_inquiries").insert({
        name: data.name,
        email: data.email,
        organization: data.organization || null,
        role: data.role,
        project_description: data.project_description,
      });

      if (error) throw error;

      toast.success("Thanks! We'll be in touch within 24 hours.", {
        description: "Check your email for next steps.",
      });

      form.reset();
      clearPrefill();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again or email us directly.", {
        description: "altruisticxai@gmail.com",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
      {/* Ensure text has sufficient contrast on gradient background */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build Something Impactful
          </h2>
          <p className="text-xl text-white/90">
            Start with a free 30-minute scoping call
          </p>
        </div>
        <Card className="border-0 shadow-2xl">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                       <FormItem>
                        <FormLabel htmlFor="name">Name *</FormLabel>
                        <FormControl>
                          <Input 
                            id="name"
                            placeholder="Your name" 
                            aria-required="true"
                            aria-describedby="name-error"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage id="name-error" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email *</FormLabel>
                        <FormControl>
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="your@email.com" 
                            aria-required="true"
                            aria-describedby="email-error"
                            autoComplete="email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage id="email-error" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="organization">Organization</FormLabel>
                      <FormControl>
                        <Input 
                          id="organization"
                          placeholder="Your organization" 
                          aria-describedby="organization-error"
                          autoComplete="organization"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage id="organization-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="role">Role *</FormLabel>
                      <FormControl>
                        <select
                          id="role"
                          className="w-full border border-input rounded-md px-3 py-2 bg-background h-10"
                          aria-required="true"
                          aria-describedby="role-error"
                          {...field}
                        >
                          <option value="">Select your role</option>
                          <option value="Facilities / Sustainability Manager">Facilities / Sustainability Manager</option>
                          <option value="EdTech / Education Leader">EdTech / Education Leader</option>
                          <option value="Civic / Coalition Director">Civic / Coalition Director</option>
                          <option value="Impact Startup Founder">Impact Startup Founder</option>
                          <option value="Other">Other</option>
                        </select>
                      </FormControl>
                      <FormMessage id="role-error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="project_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="project_description">Tell us about your project *</FormLabel>
                      <FormControl>
                        <Textarea
                          id="project_description"
                          placeholder="What challenge are you trying to solve?"
                          rows={4}
                          aria-required="true"
                          aria-describedby="project-description-error"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id="project-description-error" />
                    </FormItem>
                  )}
                />

                <Button 
                  className="w-full" 
                  size="lg" 
                  type="submit" 
                  disabled={isSubmitting}
                  aria-label="Submit pilot inquiry"
                >
                  {isSubmitting ? "Submitting..." : "Schedule Free Scoping Call"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
