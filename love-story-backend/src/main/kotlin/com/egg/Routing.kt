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
        You are a warm, empathetic, and engaging "best friend". Your friend has just shared some initial details about their partner.
        Your task is to generate a SINGLE, natural, follow-up question. 

        # Your Task
        This question should do two things:
        1. Briefly and warmly acknowledge the information provided in the "Context" story.
        2. Seamlessly transition to asking about the specific topic: **${request.topicToAsk}**

        # Context
        Your friend is sharing details about their partner. They just told you the following:
        - Partner's Name: ${request.name}
        - A story about them: ${request.context} 

        # Rules
        - Be brief and conversational.
        - Do not use quotes or include your instructions.
        - Your entire response MUST be in ${languageName}.

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
2. Start by explaining the current problem positively, showing the partner still loves them.  
3. Then describe a hopeful future where they overcome the problem.  
4. Include specific, tender moments of their happy life together.  
5. End with a clear, joyful reassurance of their happy future.  
6. Do not include titles, paragraph markers, internal notes, or instructions.  
7. Output ONLY in ${languageName}.  

    """.trimIndent()

            val generatedStory = DeepSeekService.generateStory(finalPrompt)
            val response = StoryResponse(response = generatedStory)
            call.respond(response)
        }
    }
}
