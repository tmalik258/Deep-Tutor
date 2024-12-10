import axios from "axios";

const API_SUBDOMAIN = "https://deep-tutor.vercel.app/sign-in?redirect_url=https%3A%2F%2Fdeep-tutor.vercel.app%2F";

// Create an anonymous user and return the token
export const createAnonymousUser = async (): Promise<string> => {
  const response = await axios.post(`https://${API_SUBDOMAIN}.readyplayer.me/api/users`);
  return response.data.data.token;
};

// Fetch available templates using the provided token
export const fetchTemplates = async (token: string): Promise<Array<any>> => {
  const response = await axios.get(`https://api.readyplayer.me/v2/avatars/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

// Create a draft avatar from a template using token and templateId
export const createDraftAvatar = async (token: string, templateId: string): Promise<string> => {
  const response = await axios.post(
    `https://api.readyplayer.me/v2/avatars/templates/${templateId}`,
    { partner: API_SUBDOMAIN, bodyType: "fullbody" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.id;
};

// Save the draft avatar permanently
export const saveDraftAvatar = async (token: string, avatarId: string): Promise<void> => {
  await axios.put(
    `https://api.readyplayer.me/v2/avatars/${avatarId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Fetch the final avatar's URL in GLB format
export const fetchFinalAvatar = async (avatarId: string): Promise<string> => {
  return `https://models.readyplayer.me/${avatarId}.glb`;
};
