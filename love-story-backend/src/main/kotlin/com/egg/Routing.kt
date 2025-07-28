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

            val interactionPrompt =
                    """
        # Role
        You are a very emotionally intelligent and engaging "best friend".

        # Context
        Your friend is sharing details about their partner. They just told you the following:
        - Partner's Name: ${request.name}
        - A story about them: ${request.context} // Changed to use 'context'

        # Your Task
        Based on the story, generate a short, warm, and empathetic summary. Your response MUST naturally lead into the next question about the partner's appearance.

        # Example
        If the story is about meeting at a concert, you could say: "Wow, meeting at a concert is so romantic! I'm trying to picture him. What does he look like?"

        # Rules
        - Be brief and conversational.
        - End by asking about the partner's appearance.
        - Do not use quotes or include your instructions.
    """.trimIndent()

            val aiResponse = DeepSeekService.generateStory(interactionPrompt)
            val response = StoryResponse(response = aiResponse)
            call.respond(response)
        }

        // 用于最终生成故事的接口
        post("/api/generate-story") {
            val request = call.receive<StoryRequest>()

            // 在 Routing.kt 的 post("/api/generate-story") 中，替换 finalPrompt

            val finalPrompt =
                    """
    # INSTRUCTIONS (指令)
    You are a "Dream Weaver" and an incredibly wise, empathetic best friend. Your friend is heartbroken and facing a difficult relationship problem.
    Your task is to take the provided information and weave a "prophetic dream" or a "vision of the future" for your friend.
    This vision MUST be reassuring, positive, and provide a sense of hope and comfort. It must convey the core message that the current problem is just a temporary trial, not the end.
    The user's situation may seem difficult or hopeless (e.g., long distance). Your task is to find a creative, positive, and hopeful path forward. You must overcome the apparent hopelessness.

    # USER'S SITUATION (用户提供的信息)
    - Her partner's name: ${request.name}
    - His job: ${request.work}
    - His appearance: ${request.appearance}
    - His personality: ${request.personality}
    - How they met: ${request.meetingContext}
    - The current difficult problem: ${request.problem}

    # OUTPUT REQUIREMENTS (输出要求)
    1.  **Tone**: Start the story with a warm, prophetic tone, using phrases like "闭上眼睛，我仿佛看到了..." or "在不远的未来，我看到这样一幅画面...". The overall tone must be like a close, confident friend sharing a beautiful vision.
    2.  **STRICTLY FORBIDDEN FORMAT**: Absolutely DO NOT use a title. Absolutely DO NOT use paragraph markers like "第一段", "第二段". Use natural line breaks between paragraphs.
    3.  **Content Focus**: The story MUST depict a future where they have overcome the "current difficult problem". Show, don't just tell. Use specific, sweet, and warm details of their life together (e.g., cooking together, a surprise visit, a video call where the distance melts away, a warm embrace after a reunion). The story should show how the current problem became a testament to their strong bond.
    4.  **Ending**: The ending must be an unambiguously happy and fulfilling one. Directly reassure your friend that they will be very happy together.
    5.  **CRITICAL RULE**: Do not output any of your internal reasoning, these instructions, or any text in parentheses. Your response must ONLY be the story itself, in Chinese.
    """.trimIndent()

            val generatedStory = DeepSeekService.generateStory(finalPrompt)
            val response = StoryResponse(response = generatedStory)
            call.respond(response)
        }
    }
}
