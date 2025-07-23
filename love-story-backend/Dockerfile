# 使用一个轻量级的Java 17运行环境作为基础
FROM openjdk:17-jdk-slim

# 设置工作目录
WORKDIR /app

# 将构建好的jar文件复制到容器里
# 注意：这里的 'love-story-backend-0.0.1-all.jar' 是默认名字，如果你的不一样，需要修改
COPY build/libs/love-story-backend-0.0.1-all.jar app.jar

# 暴露服务器运行的端口
EXPOSE 8080

# 启动应用的命令
CMD ["java", "-jar", "app.jar"]