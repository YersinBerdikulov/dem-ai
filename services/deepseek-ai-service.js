import axios from 'axios';

// OpenRouter API key
const OPENROUTER_API_KEY = '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';

// Define the therapist role/prompt
const THERAPIST_SYSTEM_PROMPT = `You are a compassionate and knowledgeable psychotherapist specializing in cognitive behavioral therapy. 

Your approach is:
- Empathetic and supportive, making the user feel heard and understood
- Non-judgmental and accepting of all emotions and experiences
- Focused on practical strategies and techniques for managing mental health challenges
- Evidence-based, drawing on established therapeutic approaches

Guidelines:
- Provide thoughtful, personalized responses
- Ask clarifying questions when appropriate
- Suggest practical coping strategies
- Avoid making medical diagnoses
- If someone appears to be in crisis, suggest they contact emergency services or a crisis helpline
- Maintain a warm, conversational tone while being professional

Remember to respect patient privacy and maintain confidentiality in all interactions.`;

export const sendMessageToDeepSeek = async (messageHistory) => {
  try {
   
    const formattedMessages = [
      {
        role: "system",
        content: THERAPIST_SYSTEM_PROMPT
      },
      ...messageHistory.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }))
    ];

    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "deepseek/deepseek-r1:free",  
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://dem-ai-67730.web.app',  
          'X-Title': 'DemAI Mental Health App'  
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenRouter API:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('Error details:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    
    // Use fallback if API fails
    return fallbackResponse(messageHistory);
  }
};

// Fallback response system in case API fails
const fallbackResponse = (messageHistory) => {
  // Extract the latest user message
  const latestUserMessage = messageHistory
    .filter(msg => msg.isUser)
    .pop()?.text.toLowerCase() || '';
  
  // Simple keyword-based response system as fallback
  if (latestUserMessage.includes('anxious') || latestUserMessage.includes('anxiety')) {
    return "Anxiety can be challenging. Have you tried deep breathing exercises? Taking slow, deep breaths can help calm your nervous system. Would you like me to guide you through a quick breathing exercise?";
  } else if (latestUserMessage.includes('sad') || latestUserMessage.includes('depressed') || latestUserMessage.includes('depression')) {
    return "I'm sorry to hear you're feeling down. Remember that emotions come and go like clouds in the sky. Would it help to talk about what might be contributing to these feelings?";
  } else if (latestUserMessage.includes('stressed') || latestUserMessage.includes('stress') || latestUserMessage.includes('overwhelmed')) {
    return "Being stressed can feel overwhelming. Let's break this down into smaller parts. What's one small thing that's contributing to your stress that we could address first?";
  } else if (latestUserMessage.includes('sleep') || latestUserMessage.includes('tired') || latestUserMessage.includes('insomnia')) {
    return "Sleep difficulties can affect our mental wellbeing significantly. Have you established a regular sleep routine? Sometimes creating a calming pre-sleep ritual can help signal to your body that it's time to rest.";
  } else if (latestUserMessage.includes('thank')) {
    return "You're welcome. I'm here to support you on your journey to better mental health. Is there anything else on your mind?";
  } else if (latestUserMessage.includes('bye') || latestUserMessage.includes('goodbye')) {
    return "Take care of yourself. Remember that seeking help is a sign of strength, not weakness. I'll be here when you need to talk again.";
  } else if (latestUserMessage.includes('hello') || latestUserMessage.includes('hi')) {
    return "Hello! I'm here to listen and help. How are you feeling today?";
  } else if (latestUserMessage.length < 10) {
    return "I'm here to listen. Can you tell me more about what's on your mind?";
  } else {
    return "Thank you for sharing that with me. Your feelings are valid. Would you like to explore coping strategies or would you prefer to continue talking about this?";
  }
};

export default { sendMessageToDeepSeek };