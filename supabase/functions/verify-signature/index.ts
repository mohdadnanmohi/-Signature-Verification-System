import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { signatureImageBase64 } = await req.json();
    
    if (!signatureImageBase64) {
      return new Response(
        JSON.stringify({ error: 'Signature image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const AI_API_KEY = Deno.env.get('AI_API_KEY');
    if (!AI_API_KEY) {
      throw new Error('AI_API_KEY is not configured');
    }

    // Use AI gateway to analyze the signature
    const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL');
    if (!AI_GATEWAY_URL) {
      throw new Error('AI_GATEWAY_URL is not configured');
    }

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert handwritten signature verification AI. Your task is to analyze signature images and determine if they appear to be genuine handwritten signatures or potential forgeries.

Analyze the signature for:
1. Stroke consistency and fluidity
2. Pressure variations (natural signatures have varied pressure)
3. Line quality and smoothness
4. Overall complexity and uniqueness
5. Signs of tracing or hesitation marks
6. Uniformity issues that suggest mechanical reproduction

You must respond with ONLY a valid JSON object in this exact format:
{
  "isGenuine": true or false,
  "confidence": number between 0 and 100,
  "analysis": "brief explanation of your assessment"
}

Do not include any other text, markdown, or formatting - just the raw JSON object.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this handwritten signature image and determine if it appears to be a genuine signature or a potential forgery. Provide your assessment in the specified JSON format.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: signatureImageBase64.startsWith('data:') 
                    ? signatureImageBase64 
                    : `data:image/png;base64,${signatureImageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI model');
    }

    // Parse the AI response
    let result;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      result = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      // Provide a default response if parsing fails
      result = {
        isGenuine: false,
        confidence: 0,
        analysis: 'Unable to analyze the signature. Please try again with a clearer image.'
      };
    }

    return new Response(
      JSON.stringify({
        isGenuine: result.isGenuine,
        confidence: result.confidence,
        analysis: result.analysis,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Signature verification error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
