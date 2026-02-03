export const normalizeNextPageUrl = (url) => {
    if (!url) return null;

    if (url.startsWith("/api/")) {
      return `/api${url}`;
    }

    return `/api/api${url}`;
  };