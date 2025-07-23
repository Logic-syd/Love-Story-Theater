# --- Stage 1: The Builder ---
# 使用一个标准的、兼容性好的Debian镜像来构建，解决 exit code 1 的问题
FROM gradle:8-jdk17-jammy AS builder

WORKDIR /home/gradle/src

COPY . .

RUN gradle shadowJar --no-daemon


# --- Stage 2: The Runner ---
# 使用一个轻量级、稳定可靠的Eclipse Temurin镜像来运行，解决 not found 的问题
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 使用通配符*来复制jar包，解决文件名可能不匹配的问题
COPY --from=builder /home/gradle/src/build/libs/*-all.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]