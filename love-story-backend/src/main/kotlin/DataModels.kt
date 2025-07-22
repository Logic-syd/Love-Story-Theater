// DataModels.kt
package com.egg
import kotlinx.serialization.Serializable

// @Serializable 注解告诉Ktor这个类可以被自动转换成JSON格式

// 1. 定义前端发送给后端的数据结构
@Serializable
data class StoryRequest(
    // 新增的5个特征
    val name: String,
    val work: String,
    val personality: String,
    val appearance: String,
    val meetingContext: String,
    // 原有的问题
    val problem: String
)

// 2. 定义后端返回给前端的数据结构
@Serializable
data class StoryResponse(
    val story: String
)