import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Session, User } from "@supabase/supabase-js";

interface PilotInquiry {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  role: string;
  project_description: string;
  status: string | null;
  created_at: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inquiries, setInquiries] = useState<PilotInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        // Check admin status asynchronously
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      const adminStatus = !!data;
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      } else {
        // Log admin login
        await supabase.rpc('log_admin_action', {
          p_user_id: userId,
          p_user_email: user?.email || '',
          p_action: 'admin_login',
          p_metadata: {},
        });
        fetchInquiries();
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast.error("Error verifying permissions");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("pilot_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    }
  };

  const handleSignOut = async () => {
    // Log admin logout
    if (user) {
      await supabase.rpc('log_admin_action', {
        p_user_id: user.id,
        p_user_email: user.email || '',
        p_action: 'admin_logout',
        p_metadata: {},
      });
    }
    
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-charcoal-800">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-sand-100">
      <header className="bg-white border-b border-border">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-charcoal-800">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Pilot Inquiries Management</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Pilot Inquiries</CardTitle>
            <CardDescription>
              All submitted pilot requests from potential partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No inquiries yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell>{inquiry.organization || "-"}</TableCell>
                        <TableCell>{inquiry.role}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {inquiry.project_description}
                        </TableCell>
                        <TableCell>
                          <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                            {inquiry.status || "new"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inquiry.created_at 
                            ? new Date(inquiry.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
