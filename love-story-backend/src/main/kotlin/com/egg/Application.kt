package com.egg

import com.egg.models.*
import com.egg.services.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import kotlinx.serialization.json.Json

fun main(args: Array<String>) {
    // io.ktor.server.netty.EngineMain.main(args)
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
            .start(wait = true)
}

fun Application.module() {
    install(CORS) {
        allowMethod(HttpMethod.Post)
        allowHeader(HttpHeaders.ContentType)
        anyHost() // In development, this allows requests from any host.
    }
    install(ContentNegotiation) {
        json(
                Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true // 这个设置很有用，可以忽略前端发来的未知字段
                }
        )
    }

    configureRouting()
}
