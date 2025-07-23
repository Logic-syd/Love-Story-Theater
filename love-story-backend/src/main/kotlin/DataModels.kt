// DataModels.kt
package com.egg
import kotlinx.serialization.Serializable

// @Serializable 注解告诉Ktor这个类可以被自动转换成JSON格式

// 1. 定义前端发送给后端的数据结构
@Serializable
data class Request(
    val info: String
)

// 2. 定义后端返回给前端的数据结构
@Serializable
data class Response(
    val response: String
)