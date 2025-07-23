# --- 阶段一: 构建器 (The Builder) ---
# 使用一个包含完整JDK和Gradle的官方镜像来构建我们的应用
FROM gradle:8-jdk17-alpine AS builder

# 设置工作目录
WORKDIR /home/gradle/src

# 将整个后端项目代码复制到构建器容器中
# 注意：因为Render的构建上下文目录是 love-story-backend，所以这里的 . 指的是该文件夹
COPY . .

# 运行 shadowJar 任务来构建我们的 "fat JAR"
# --no-daemon 是在CI/CD环境中运行Gradle的好习惯
RUN gradle shadowJar --no-daemon


# --- 阶段二: 运行器 (The Runner) ---
# 使用一个轻量级的、只包含Java运行环境的镜像作为最终的运行环境
FROM openjdk:17-jre-slim

# 设置工作目录
WORKDIR /app

# 从“构建器”阶段，只复制我们最终需要的那个 .jar 文件进来
# 使用通配符 * 来匹配文件名，这样即使版本号改变了也不影响
COPY --from=builder /home/gradle/src/build/libs/*-all.jar app.jar

# 暴露端口
EXPOSE 8080

# 最终运行应用的命令
CMD ["java", "-jar", "app.jar"]