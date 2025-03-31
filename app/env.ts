declare global {
  interface Window {
    env: Record<string, any>;
  }
}

// const env = window.env;

// if (!env) {
//   throw new Error(
//     "Config could not be be parsed. \nSee: https://docs.getoutline.com/s/hosting/doc/troubleshooting-HXckrzCqDJ#h-config-could-not-be-parsed"
//   );
// }

const env = {
  analytics: [],
  ENVIRONMENT: "development",
  URL: "https://wiki.ganfan.tech",
  COLLABORATION_URL: "wss://wiki.ganfan.tech",
  DEFAULT_LANGUAGE: "en_US",
  EMAIL_ENABLED: true,
  AWS_S3_ACCELERATE_URL: "",
  AWS_S3_UPLOAD_BUCKET_URL: "",
  FILE_STORAGE_IMPORT_MAX_SIZE: 1000000,
  APP_NAME: "Outline",
  SLACK_CLIENT_ID: "4405572141360.4430632777666",
};

window.env = env;

export default env;
