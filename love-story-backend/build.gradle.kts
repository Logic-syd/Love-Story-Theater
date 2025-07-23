
plugins {
    id 'org.jetbrains.kotlin.jvm' version '1.9.23'
    id 'io.ktor.plugin' version '2.3.7' // 替代 alias(libs.plugins.ktor)
    id 'org.jetbrains.kotlin.plugin.serialization' version '1.9.23'
    id 'com.github.johnrengelman.shadow' version '8.1.1'
}
kotlin {
    jvmToolchain(16)
}

group = "com.egg"
version = "0.0.1"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.server.netty)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.config.yaml)
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
    implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")
    implementation("io.ktor:ktor-server-content-negotiation-jvm")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm")
    implementation("io.ktor:ktor-client-core-jvm")
    implementation("io.ktor:ktor-client-cio-jvm") // CIO是一个轻量级的客户端引擎
    implementation("io.ktor:ktor-client-content-negotiation-jvm") // 让客户端也能处理JSON
    implementation("io.ktor:ktor-server-cors-jvm")
}
