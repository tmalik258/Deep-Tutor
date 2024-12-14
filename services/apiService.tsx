import axios from "axios";

// Define the subdomain
const API_SUBDOMAIN = "deep-tutor-1ed7b6.readyplayer.me";

// Create an anonymous user and return the token
export const createAnonymousUser = async (): Promise<string> => {
  try {
    const response = await axios.post(`https://${API_SUBDOMAIN}/api/users`);
    return response.data.data.token;
  } catch (error) {
    console.error("Error creating anonymous user:", error);
    throw error;
  }
};

// Fetch available templates using the provided token
export const fetchTemplates = async (token: string): Promise<Array<any>> => {
  try {
    const response = await axios.get(`https://${API_SUBDOMAIN}/api/templates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

// Create a draft avatar from a template using token and templateId
export const createDraftAvatar = async (token: string, templateId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `https://${API_SUBDOMAIN}/api/templates/${templateId}`,
      { partner: API_SUBDOMAIN, bodyType: "fullbody" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data.id;
  } catch (error) {
    console.error("Error creating draft avatar:", error);
    throw error;
  }
};

// Save the draft avatar permanently
export const saveDraftAvatar = async (token: string, avatarId: string): Promise<void> => {
  try {
    await axios.put(
      `https://${API_SUBDOMAIN}/api/avatars/${avatarId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error saving draft avatar:", error);
    throw error;
  }
};

// Fetch the final avatar's URL in GLB format
export const fetchFinalAvatar = async (avatarId: string): Promise<string> => {
  try {
    return `https://models.readyplayer.me/${avatarId}.glb`;
  } catch (error) {
    console.error("Error fetching final avatar:", error);
    throw error;
  }
};
