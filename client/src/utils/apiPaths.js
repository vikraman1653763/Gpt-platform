// src/utils/api.js
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const API_PATHS = {
  USER: {
    REGISTER: "/api/user/register",
    LOGIN: "/api/user/login",
    DATA: "/api/user/data",          // get current user (protected)
    IS_AUTH: "/api/user/data",       // alias for your existing frontend usage
    PUBLISHED_IMAGES: "/api/user/published-images",
    // LOGOUT not present on backend
  },

  CHAT: {
    CREATE: "/api/chat/create",      // protected
    GET: "/api/chat/get",            // protected
    DELETE: "/api/chat/delete",      // protected
  },

  MESSAGE: {
    TEXT: "/api/message/text",       // protected
    IMAGE: "/api/message/image",     // protected
  },

  CREDIT: {
    PLAN: "/api/credit/plan",
    PURCHASE: "/api/credit/purchase" // protected
  },

  STRIPE: {
    WEBHOOK: "/api/stripe",          // server-side webhook
  },
};
 