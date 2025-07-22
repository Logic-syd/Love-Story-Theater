package com.egg
import io.github.cdimascio.dotenv.dotenv

// 使用 object 创建一个单例，方便在任何地方调用
object AppConfig {

    // 使用 lazy 属性，确保只在第一次使用时加载环境变量
    private val dotenv = dotenv {
        ignoreIfMissing = true // 如果在生产环境没有.env文件，也不会报错
    }

    // 从环境变量中读取API Key
    // System.getenv() 会先检查系统环境变量，如果找不到，dotenv[]会从.env文件读取
    val deepSeekApiKey: String = System.getenv("DEEPSEEK_API_KEY") ?: dotenv["DEEPSEEK_API_KEY"]
        ?: throw IllegalStateException("DEEPSEEK_API_KEY not found in environment variables or .env file")
}