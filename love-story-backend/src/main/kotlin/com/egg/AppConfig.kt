package com.egg

import io.github.cdimascio.dotenv.dotenv

object AppConfig {
    private val dotenv = dotenv { ignoreIfMissing = true }

    val deepSeekApiKey: String =
            System.getenv("DEEPSEEK_API_KEY")
                    ?: dotenv["DEEPSEEK_API_KEY"]
                            ?: throw IllegalStateException(
                            "DEEPSEEK_API_KEY not found in environment variables or .env file"
                    )
}
