// generate.js
// Necesitas instalar el paquete: npm install @google/genai

// Importa la SDK oficial de Google Gen AI
const { GoogleGenAI } = require("@google/genai");

// Inicializa el cliente. Si la variable de entorno GEMINI_API_KEY existe,
// la librería la usa automáticamente.
// Si tu clave tiene otro nombre, pásala aquí: { apiKey: process.env.TU_CLAVE }
const ai = new GoogleGenAI({});

// Nombre del modelo que quieres usar (por ejemplo, el que tienes en el nivel gratuito)
const MODEL_NAME = "gemini-2.5-flash";

exports.handler = async (event, context) => {
    // Solo permitimos peticiones POST, que es lo que envías desde el frontend.
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        // Obtenemos el cuerpo de la petición (donde estará el prompt)
        const data = JSON.parse(event.body);
        const { prompt } = data;

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing 'prompt' in request body." })
            };
        }

        // 1. Llamada SEGURA a la API de Gemini (desde el servidor de Netlify)
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        const generatedText = response.text;

        // 2. Devolvemos la respuesta al frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ generatedText })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate content.", details: error.message })
        };
    }
};