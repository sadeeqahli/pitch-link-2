import { fetch as expoFetch } from 'expo/fetch';

// Simplified fetch implementation - removed all create.xyz dependencies
// You now own your fetch implementation
const fetchToWeb = async function fetchWithHeaders(...args: Parameters<typeof expoFetch>) {
  // Use expo's fetch directly without any create.xyz proxy or authentication
  return expoFetch(...args);
};

export default fetchToWeb;
