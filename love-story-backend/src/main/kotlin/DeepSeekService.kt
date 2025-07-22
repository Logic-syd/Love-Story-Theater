// DeepSeekService.kt

package com.egg

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

// --- 定义调用DeepSeek API需要的数据结构 ---

@Serializable
data class DeepSeekMessage(val role: String, val content: String)

@Serializable
data class DeepSeekRequest(val model: String, val messages: List<DeepSeekMessage>)

@Serializable
data class DeepSeekChoice(val message: DeepSeekMessage)

@Serializable
data class DeepSeekResponse(val choices: List<DeepSeekChoice>)

// --- 创建服务对象 ---

object DeepSeekService {

    private const val DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

    // 创建一个可复用的HTTP客户端
    private val client = HttpClient(CIO) {
        engine {
            requestTimeout = 30000 // 将请求超时设置为30秒 (30000毫秒)
        }
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
    }

    // 定义一个异步函数来生成故事
    suspend fun generateStory(prompt: String): String {
        return try {
            val response: DeepSeekResponse = client.post(DEEPSEEK_API_URL) {
                // 设置请求头
                header(HttpHeaders.Authorization, "Bearer ${AppConfig.deepSeekApiKey}")
                contentType(ContentType.Application.Json)

                // 构建请求体
                val requestBody = DeepSeekRequest(
                    model = "deepseek-chat", // 或者使用 deepseek-coder，根据你的需求
                    messages = listOf(
                        DeepSeekMessage(role = "user", content = prompt)
                    )
                )
                setBody(requestBody)
            }.body() // 发送请求并获取响应体

            // 从响应中提取故事文本
            response.choices.firstOrNull()?.message?.content?.trim() ?: "AI未能生成故事，请稍后再试。"

        } catch (e: Exception) {
            println("调用DeepSeek API时发生错误: ${e.message}")
            "调用AI服务时出错，请检查服务器日志。"
        }
    }
}