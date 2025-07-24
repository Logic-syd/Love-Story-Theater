package com.egg.services

import com.egg.AppConfig
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

// --- DTOs for DeepSeek API ---
// (DTOs: Data Transfer Objects, a standard name for these data classes)
@Serializable private data class DeepSeekMessage(val role: String, val content: String)

@Serializable
private data class DeepSeekRequest(val model: String, val messages: List<DeepSeekMessage>)

@Serializable private data class DeepSeekChoice(val message: DeepSeekMessage)

@Serializable private data class DeepSeekResponse(val choices: List<DeepSeekChoice>)

object DeepSeekService {

    private const val DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

    private val client =
            HttpClient(CIO) {
                engine {
                    requestTimeout = 30000 // 30 second timeout
                }
                install(ContentNegotiation) {
                    json(
                            Json {
                                prettyPrint = true
                                isLenient = true
                                ignoreUnknownKeys = true
                            }
                    )
                }
            }

    suspend fun generateStory(prompt: String): String {
        return try {
            val response: DeepSeekResponse =
                    client
                            .post(DEEPSEEK_API_URL) {
                                header(
                                        HttpHeaders.Authorization,
                                        "Bearer ${AppConfig.deepSeekApiKey}"
                                )
                                contentType(ContentType.Application.Json)

                                val requestBody =
                                        DeepSeekRequest(
                                                model = "deepseek-chat",
                                                messages =
                                                        listOf(
                                                                DeepSeekMessage(
                                                                        role = "user",
                                                                        content = prompt
                                                                )
                                                        )
                                        )
                                setBody(requestBody)
                            }
                            .body()

            response.choices.firstOrNull()?.message?.content?.trim() ?: "AI未能生成故事，请稍后再试。"
        } catch (e: Exception) {
            println("调用DeepSeek API时发生错误: ${e.message}")
            "调用AI服务时出错，请检查服务器日志。"
        }
    }
}
