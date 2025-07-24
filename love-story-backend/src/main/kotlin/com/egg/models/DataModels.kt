package com.egg.models

import kotlinx.serialization.Serializable

// 用于最终生成故事的请求，包含所有信息
@Serializable
data class StoryRequest(
        val name: String,
        val meetingContext: String,
        val work: String,
        val appearance: String,
        val personality: String,
        val problem: String
)

// 用于中间动态交互的请求
@Serializable
data class DynamicInteractionRequest(
        val name: String,
        val appearance: String,
        val meetingContext: String
)

// 用于所有API返回的统一响应结构
@Serializable data class StoryResponse(val response: String)
