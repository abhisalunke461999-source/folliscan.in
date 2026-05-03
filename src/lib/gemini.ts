import { GoogleGenAI } from "@google/genai";
import { HairCondition, ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are a highly specialized AI Scalp & Follicle Pathologist. 
Your task is to perform a detailed visual audit of a scalp image.

**Diagnostic Protocol:**
1. **Follicle Density:** Evaluate the number of hairs per follicular unit. Note any miniaturization.
2. **Scalp Environment:** Inspect for erythema (redness), seborrhea (oiliness), or pityriasis (dandruff/scaling).
3. **Distribution Pattern:** Check if thinning is diffuse, patchy, or concentrated in specific zones (vertex, temporal).
4. **Contextual Calibration:** Cross-reference visual data with the provided Age and Gender.

**Response Schema (JSON):**
{
  "condition": "Healthy" | "Telogen Effluvium" | "Androgenetic Alopecia" | "Seborrheic Dermatitis" | "Alopecia Areata",
  "confidence": number (0.0 to 1.0),
  "observations": string[] (at least 3 specific clinical findings found in the image),
  "recommendations": string[] (actionable next steps based on the diagnosis)
}

**Confidence Scoring Thresholds:**
- > 0.85: Clear visual evidence matching classic pathology.
- 0.60 - 0.85: Probable condition, but requires tactile verification.
- < 0.60: Low visual clarity or ambiguous markers. 

**STRICT RULE:** If the image is NOT a scalp or is too blurry to see follicles, return "Healthy" with a confidence score < 0.2 and state "Insufficient visual clarity" in observations.
`;

export async function analyzeScalp(imageBase64: string, age: number, gender: string): Promise<ScanResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: `PATIENT PROFILE: Age ${age}, Biological Gender ${gender}. PERFORM SCALP AUDIT.` },
            { 
              inlineData: { 
                mimeType: "image/jpeg", 
                data: imageBase64.split(',')[1] || imageBase64 
              } 
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      condition: result.condition || 'Healthy',
      confidence: result.confidence || 0.5,
      observations: result.observations || ['Limited visual data available'],
      recommendations: result.recommendations || ['Consult a dermatologist for a physical exam']
    };
  } catch (error) {
    console.error("Scalp analysis failed:", error);
    return {
      condition: 'Healthy',
      confidence: 0,
      observations: ['Analysis error'],
      recommendations: ['Please try uploading a clearer image']
    };
  }
}
