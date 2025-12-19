import Groq from "groq-sdk";

// Use the Groq-specific environment variable name
const apiKey = process.env.REACT_APP_GROQ_API_KEY;

console.log("Groq API Key loaded:", apiKey ? "✓ Yes" : "✗ No");

if (!apiKey) {
  throw new Error("REACT_APP_GROQ_API_KEY environment variable is not set");
}

// Initialize the Groq client
export const groq = new Groq({ 
    apiKey: apiKey,
    // Note: If using in a browser/React, you may need to add:
    dangerouslyAllowBrowser: true 
});

export default groq;