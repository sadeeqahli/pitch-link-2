import * as React from 'react';
import { UploadClient } from '@uploadcare/upload-client'

// Use your own Uploadcare public key or replace with your own upload service
const client = new UploadClient({ publicKey: 'YOUR_UPLOADCARE_PUBLIC_KEY' }); // Replace with your own key

function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);
      let response;

      if ("reactNativeAsset" in input && input.reactNativeAsset) {
        let asset = input.reactNativeAsset;

        // If the asset doesn't have a file, fetch it as a blob and create a 
        // File object (web only)
        if (!asset.file && asset.uri) {
          try {
            const res = await fetch(asset.uri);
            const blob = await res.blob();
            asset.file = new File(
              [blob],
              asset.name || asset.uri.split("/").pop() || "upload",
              { type: asset.mimeType || blob.type }
            );
          } catch (err) {
            console.error("Failed to fetch asset as blob:", err);
          }
        }

        if (asset.file) {
          // Use your own upload endpoint
          const formData = new FormData();
          formData.append("file", asset.file);

          response = await fetch("https://your-upload-endpoint.com/upload", { // Replace with your own endpoint
            method: "POST",
            body: formData,
          });
        } else {
          // Fallback to Uploadcare upload (you can replace this entirely)
          const result = await client.uploadFile(asset, {
            fileName: asset.name ?? asset.uri.split("/").pop(),
            contentType: asset.mimeType,
          });
          
          // Use your own content URL or Uploadcare's
          return { url: `https://ucarecdn.com/${result.uuid}/`, mimeType: result.mimeType || null };
        }
      } else if ("url" in input) {
        // Use your own upload endpoint
        response = await fetch("https://your-upload-endpoint.com/upload-url", { // Replace with your own endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ url: input.url })
        });
      } else if ("base64" in input) {
        // Use your own upload endpoint
        response = await fetch("https://your-upload-endpoint.com/upload-base64", { // Replace with your own endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ base64: input.base64 })
        });
      } else {
        // Use your own upload endpoint
        response = await fetch("https://your-upload-endpoint.com/upload-buffer", { // Replace with your own endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream"
          },
          body: input.buffer
        });
      }
      
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload failed: File too large.");
        }
        throw new Error("Upload failed");
      }
      
      const data = await response.json();
      return { url: data.url, mimeType: data.mimeType || null };
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        return { error: uploadError.message };
      }
      if (typeof uploadError === "string") {
        return { error: uploadError };
      }
      return { error: "Upload failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }];
}

export { useUpload };
export default useUpload;