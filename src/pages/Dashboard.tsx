import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Heart, User, Shield, Bell, MapPin, Activity, LogOut,
  AlertTriangle, ArrowLeft, Save, Loader2
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [healthProfile, setHealthProfile] = useState<any>(null);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    blood_group: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  useEffect(() => {
    if (user) {
      fetchData();
      // Subscribe to real-time SOS alerts
      const channel = supabase
        .channel("sos-alerts")
        .on("postgres_changes", { event: "*", schema: "public", table: "sos_alerts" }, (payload) => {
          if (payload.eventType === "INSERT") {
            setSosAlerts((prev) => [payload.new as any, ...prev]);
            toast({
              title: "🚨 New SOS Alert!",
              description: `Emergency at ${(payload.new as any).latitude.toFixed(4)}, ${(payload.new as any).longitude.toFixed(4)}`,
              variant: "destructive",
            });
          } else if (payload.eventType === "UPDATE") {
            setSosAlerts((prev) => prev.map((a) => (a.id === (payload.new as any).id ? payload.new as any : a)));
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [healthRes, sosRes] = await Promise.all([
      supabase.from("health_profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("sos_alerts").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(10),
    ]);
    if (healthRes.data) {
      setHealthProfile(healthRes.data);
      setFormData({
        blood_group: healthRes.data.blood_group || "",
        emergency_contact_name: healthRes.data.emergency_contact_name || "",
        emergency_contact_phone: healthRes.data.emergency_contact_phone || "",
        allergies: (healthRes.data.allergies || []).join(", "),
        conditions: (healthRes.data.conditions || []).join(", "),
        medications: (healthRes.data.medications || []).join(", "),
      });
    }
    setSosAlerts(sosRes.data || []);
    setLoading(false);
  };

  const saveHealthProfile = async () => {
    setSaving(true);
    const payload = {
      user_id: user!.id,
      blood_group: formData.blood_group || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : null,
      conditions: formData.conditions ? formData.conditions.split(",").map((s) => s.trim()) : null,
      medications: formData.medications ? formData.medications.split(",").map((s) => s.trim()) : null,
    };

    const { error } = healthProfile
      ? await supabase.from("health_profiles").update(payload).eq("user_id", user!.id)
      : await supabase.from("health_profiles").insert(payload);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Health profile updated." });
      fetchData();
    }
    setSaving(false);
  };

  const triggerSOS = async () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { error } = await supabase.from("sos_alerts").insert({
          user_id: user!.id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          description: "Emergency SOS triggered from dashboard",
        });
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "🚨 SOS Sent!", description: "Nearby warriors have been alerted." });
        }
      },
      () => toast({ title: "Error", description: "Could not get location", variant: "destructive" })
    );
  };

  const respondToAlert = async (alertId: string) => {
    const { error } = await supabase
      .from("sos_alerts")
      .update({ status: "responded", responded_by: user!.id })
      .eq("id", alertId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Responding!", description: "You are now responding to this alert." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Sanjeevani</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/ai-assistant">
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="h-4 w-4" /> AI Assistant
              </Button>
            </Link>
            <Button variant="sos" size="sm" className="gap-2 animate-pulse-emergency" onClick={triggerSOS}>
              <AlertTriangle className="h-4 w-4" /> SOS
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {profile?.full_name || user?.email}
          </h1>
          <p className="text-muted-foreground">Manage your health profile and respond to emergencies</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Profile Form */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-primary" /> Health Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Blood Group</label>
                <Input value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} placeholder="e.g. O+" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Emergency Contact Name</label>
                <Input value={formData.emergency_contact_name} onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Emergency Contact Phone</label>
                <Input value={formData.emergency_contact_phone} onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Allergies (comma-separated)</label>
                <Input value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} placeholder="e.g. Penicillin, Peanuts" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Medical Conditions</label>
                <Input value={formData.conditions} onChange={(e) => setFormData({ ...formData, conditions: e.target.value })} placeholder="e.g. Diabetes, Asthma" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Current Medications</label>
                <Input value={formData.medications} onChange={(e) => setFormData({ ...formData, medications: e.target.value })} placeholder="e.g. Metformin 500mg" />
              </div>
              <Button onClick={saveHealthProfile} disabled={saving} className="w-full gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Health Profile
              </Button>
            </div>
          </Card>

          {/* Active SOS Alerts */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Bell className="h-5 w-5 text-destructive" /> Active SOS Alerts
              <span className="ml-auto text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                {sosAlerts.length} active
              </span>
            </h2>
            {sosAlerts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active emergencies nearby.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sosAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-destructive uppercase">{alert.status}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                    </div>
                    {alert.description && (
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    )}
                    {alert.status === "active" && alert.user_id !== user?.id && (
                      <Button size="sm" variant="destructive" className="w-full gap-2" onClick={() => respondToAlert(alert.id)}>
                        <Shield className="h-3 w-3" /> Respond to Emergency
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
