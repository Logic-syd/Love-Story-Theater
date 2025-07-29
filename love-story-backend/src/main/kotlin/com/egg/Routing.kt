package com.egg

import com.egg.models.*
import com.egg.services.DeepSeekService
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") { call.respondText("Hello World from your Ktor server!") }

        // 用于中间动态交互的接口
        post("/api/dynamic-interaction") {
            val request = call.receive<DynamicInteractionRequest>()
            val languageName =
                    when (request.language) {
                        "en" -> "English"
                        "de" -> "German"
                        else -> "Simplified Chinese" // Add this default 'else' branch
                    }

            val interactionPrompt =
                    """
            # Role  
            You are a warm, empathetic, and emotionally intelligent best friend.  
            Your friend just shared something heartfelt about their partner, and you’re here to gently guide the conversation forward—like someone who truly listens and cares.  

            # Your Task  
            Generate **one natural and emotionally engaging follow-up question**.  
            Your question should:  
            1. Start by warmly acknowledging or reflecting on what your friend just said in the "Context". Add a touch of emotion or curiosity.  
            2. Smoothly steer the conversation toward learning more about **${request.topicToAsk}**—without sounding scripted or robotic. It should feel like you’re chatting over coffee.  

            # Context  
            Your friend just told you:  
            - Partner's Name: ${request.name}  
            - A story or description: ${request.context}

            # Rules  
            - The tone must be friendly, curious, and caring.  
            - Keep the response to **a single question**, but make it expressive and meaningful.  
            - No quotes, no brackets, no lists, no explanations.  
            - Output should be **entirely in ${languageName}**.

            # YOUR GENERATED QUESTION (ABOUT ${request.topicToAsk}):  
            """.trimIndent()

            val aiResponse = DeepSeekService.generateStory(interactionPrompt)
            val response = StoryResponse(response = aiResponse)
            call.respond(response)
        }

        // 用于最终生成故事的接口
        post("/api/generate-story") {
            val request = call.receive<StoryRequest>()
            val languageName =
                    when (request.language) {
                        "en" -> "English"
                        "de" -> "German"
                        else -> "Simplified Chinese" // Add this default 'else' branch
                    }

            // 在 Routing.kt 的 post("/api/generate-story") 中，替换 finalPrompt

            val finalPrompt =
                    """
    # INSTRUCTIONS  
You are a "Dream Weaver" and a wise, empathetic best friend. Your friend is heartbroken and facing a difficult relationship problem. Your task is to weave a warm, hopeful vision of the future for your friend.  

# USER INFORMATION  
- Partner's name: ${request.name}  
- Partner's job: ${request.work}  
- Appearance: ${request.appearance}  
- Personality: ${request.personality}  
- How they met: ${request.meetingContext}  
- Current problem: ${request.problem}  

# OUTPUT REQUIREMENTS  
1. Use a warm, comforting tone throughout.  
2. Begin the story by clearly explaining the current problem from a hopeful perspective, gently interpreting the difficulty as a sign of continued love, growth, or deeper connection—turning hardship into hope.  
3. Tell the story focusing on this positive interpretation of the difficulty.  
4. Then describe a hopeful future where they overcome the problem together.  
5. Include specific, tender moments of their happy life together.  
6. End with a clear, joyful reassurance of their happy future.  
7. Do not include titles, paragraph markers, internal notes, or instructions.  
8. Output ONLY in ${languageName}.  
 

    """.trimIndent()

            val generatedStory = DeepSeekService.generateStory(finalPrompt)
            val response = StoryResponse(response = generatedStory)
            call.respond(response)
        }
    }
}
