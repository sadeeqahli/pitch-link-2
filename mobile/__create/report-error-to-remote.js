import { serializeError } from 'serialize-error';

export const reportErrorToRemote = async ({ error }) => {
  // Removed external error reporting to create.xyz services
  // You now own your error reporting and can implement your own solution
  console.debug('Error occurred in your app:', error);
  return { success: true };
};
