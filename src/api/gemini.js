const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyC-blTlUHINPqDy-XYgcmap83pRBgVhitk");

async function generateContent(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

async function run() {
  const prompt = "write tomato soup recipe";
  const result = await generateContent(prompt);
  console.log(result);
}

module.exports = generateContent;
