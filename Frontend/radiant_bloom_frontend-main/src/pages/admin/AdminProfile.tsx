import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import { User, Mail, Phone, MapPin, Building, Calendar } from "lucide-react";
import { profileService, ProfileData, UpdateProfileData } from "@/services/profileService";

const AdminProfile = () => {
  console.log("🔍 AdminProfile component rendered");
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Administrator",
    department: "Management",
    address: "156-157, Block 3, BYJCHS, Bahadurabad, Karachi",
    joinDate: "2024-01-01",
    bio: "System Administrator for Radiant Bloom e-commerce platform. Responsible for managing products, orders, and customer relations."
  });

  // Load admin data from API
  useEffect(() => {
    console.log("🔍 AdminProfile useEffect triggered");
    const loadProfile = async () => {
      try {
        console.log("🔍 Attempting to load profile from API");
        const profileData = await profileService.getProfile();
        console.log("🔍 Profile data received:", profileData);
        
        if (profileData && typeof profileData === 'object') {
          setProfile(prev => ({
            ...prev,
            firstName: profileData.firstName || prev.firstName,
            lastName: profileData.lastName || prev.lastName,
            email: profileData.email || prev.email,
            phone: profileData.phone || prev.phone,
            role: profileData.role === 'admin' ? 'Administrator' : 'User',
          }));
        } else {
          console.error("🔍 Invalid profile data received:", profileData);
          throw new Error("Invalid profile data received from API");
        }
      } catch (error) {
        console.error("🔍 Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        
        // Fallback to localStorage
        console.log("🔍 Falling back to localStorage");
        const userData = localStorage.getItem("user");
        console.log("🔍 localStorage user data:", userData);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            console.log("🔍 Parsed user data:", user);
            setProfile(prev => ({
              ...prev,
              firstName: user.firstName || "Admin",
              lastName: user.lastName || "User",
              email: user.email || "admin@radiantbloom.com",
            }));
          } catch (error) {
            console.error("Error loading user data from localStorage:", error);
          }
        } else {
          // If no localStorage data, set default values
          console.log("🔍 No localStorage data, setting defaults");
          setProfile(prev => ({
            ...prev,
            firstName: "Admin",
            lastName: "User",
            email: "admin@radiantbloom.com",
          }));
        }
      } finally {
        console.log("🔍 Setting loading to false");
        setLoading(false);
      }
    };

    loadProfile();
  }, [toast]);

  console.log("🔍 Current state - loading:", loading, "profile:", profile);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const updateData: UpdateProfileData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        phone: updatedProfile.phone || prev.phone,
      }));

      // Update localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const updatedUser = {
            ...user,
            firstName: updatedProfile.firstName,
            lastName: updatedProfile.lastName,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
          console.error("Error updating localStorage:", error);
        }
      }

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Profile</h1>
          <p className="text-muted-foreground">
            Manage your administrator account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground">{profile.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-muted-foreground">{profile.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Join Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline">
                Change Password
              </Button>
              <Button variant="outline">
                Two-Factor Authentication
              </Button>
              <Button variant="outline">
                Login History
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminProfile;
