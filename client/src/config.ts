const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Env ${key} não configurada`);
  }
  return value;
};

export const config = {
  userServiceUrl: getEnv("REACT_APP_USER_SERVICE_URL"),
  firebase: {
    apiKey: getEnv("REACT_APP_FIREBASE_API_KEY"),
    authDomain: getEnv("REACT_APP_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("REACT_APP_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("REACT_APP_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("REACT_APP_FIREBASE_APP_ID"),
    measurementId: getEnv("REACT_APP_FIREBASE_MEASUREMENT_ID"),
  },
};
