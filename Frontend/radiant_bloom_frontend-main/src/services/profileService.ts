import { API_BASE_URL } from '@/config/api';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

class ProfileService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getProfile(): Promise<ProfileData> {
    console.log("🔍 ProfileService: Making API call to", `${API_BASE_URL}/auth/me`);
    console.log("🔍 ProfileService: Headers", this.getAuthHeaders());
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    console.log("🔍 ProfileService: Response status", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔍 ProfileService: Error response", errorText);
      throw new Error(`Failed to fetch profile: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("🔍 ProfileService: Response data", data);
    console.log("🔍 ProfileService: data.data", data.data);
    console.log("🔍 ProfileService: data.data.user", data.data?.user);
    
    // Handle different response formats
    // Expected format: { success: true, data: { user: {...} }, message: "..." }
    if (data.data && data.data.user) {
      return data.data.user;
    } else if (data.user) {
      return data.user;
    } else if (data.data) {
      return data.data;
    } else {
      console.error("🔍 ProfileService: Unexpected response format", data);
      throw new Error("Unexpected response format");
    }
  }

  async updateProfile(profileData: UpdateProfileData): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await response.json();
    console.log("🔍 ProfileService: Update response data", data);
    
    // Handle different response formats
    if (data.data && data.data.user) {
      return data.data.user;
    } else if (data.user) {
      return data.user;
    } else if (data.data) {
      return data.data;
    } else {
      console.error("🔍 ProfileService: Unexpected update response format", data);
      throw new Error("Unexpected response format");
    }
  }
}

export const profileService = new ProfileService();
