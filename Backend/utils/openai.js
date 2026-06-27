import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log(
      "Gemini Response:",
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Gemini API request failed"
      );
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return answer || "No response from model";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return `ERROR: ${err.message}`;
  }
};

export default getOpenAIAPIResponse;