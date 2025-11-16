import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InquiryPayload {
  type: string;
  table: string;
  record: {
    id: string;
    name: string;
    email: string;
    organization: string | null;
    role: string;
    project_description: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received notification request");
    
    const payload: InquiryPayload = await req.json();
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const { record } = payload;

    // Initialize Supabase client to fetch admin emails
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all admin users
    const { data: adminRoles, error: adminError } = await supabaseClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (adminError) {
      console.error("Error fetching admin roles:", adminError);
      throw adminError;
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log("No admin users found to notify");
      return new Response(
        JSON.stringify({ message: "No admin users to notify" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get admin user emails from auth.users
    const adminUserIds = adminRoles.map((role) => role.user_id);
    const { data: adminUsers, error: usersError } = await supabaseClient.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching admin users:", usersError);
      throw usersError;
    }

    const adminEmails = adminUsers.users
      .filter((user) => adminUserIds.includes(user.id))
      .map((user) => user.email)
      .filter((email): email is string => !!email);

    if (adminEmails.length === 0) {
      console.log("No admin emails found");
      return new Response(
        JSON.stringify({ message: "No admin emails found" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Sending notification to ${adminEmails.length} admin(s)`);

    // Send email notification to all admins using Resend API directly
    const emailPromises = adminEmails.map((adminEmail) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "AltruisticX AI <onboarding@resend.dev>",
          to: [adminEmail],
          subject: `New Pilot Inquiry from ${record.name}`,
          html: `
            <h1>New Pilot Inquiry Submitted</h1>
            <p>A new pilot inquiry has been submitted. Here are the details:</p>
            
            <h2>Contact Information</h2>
            <ul>
              <li><strong>Name:</strong> ${record.name}</li>
              <li><strong>Email:</strong> ${record.email}</li>
              <li><strong>Organization:</strong> ${record.organization || "N/A"}</li>
              <li><strong>Role:</strong> ${record.role}</li>
            </ul>
            
            <h2>Project Description</h2>
            <p>${record.project_description}</p>
            
            <h2>Submitted</h2>
            <p>${new Date(record.created_at).toLocaleString()}</p>
            
            <hr>
            <p>View the inquiry in your admin dashboard to respond.</p>
          `,
        }),
      }).then((res) => res.json())
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    console.log(`Email notifications sent: ${successCount} succeeded, ${failureCount} failed`);

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Failed to send email to ${adminEmails[index]}:`, result.reason);
      }
    });

    return new Response(
      JSON.stringify({
        message: "Notification processed",
        sent: successCount,
        failed: failureCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-admin-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
