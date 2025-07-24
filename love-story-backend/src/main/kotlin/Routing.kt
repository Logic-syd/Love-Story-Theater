// Routing.kt

// (这个文件顶部没有 package 声明)
package com.egg

import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        get("/") { call.respondText("Hello World!") }
        post("/api/question") {
            val request = call.receive<StoryRequest>()

            // ... finalPrompt 内容不变 ...
            val finalPrompt = """...""".trimIndent()

            // --- 使用你自己的函数名 ---
            val generateResponse = DeepSeekService.generateStory(finalPrompt)

            val response = StoryResponse(response = generateResponse)
            call.respond(response)
        }
        post("/api/generate-story") {
            val request = call.receive<StoryRequest>()

            // ... finalPrompt 内容不变 ...
            val finalPrompt = """...""".trimIndent()

            // --- 使用你自己的函数名 ---
            val generatedStory = DeepSeekService.generateStory(finalPrompt)

            val response = StoryResponse(response = generatedStory)
            call.respond(response)
        }
    }
}
