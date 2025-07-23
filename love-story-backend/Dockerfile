# --- Stage 1: The Builder ---
FROM gradle:8-jdk17-alpine AS builder

WORKDIR /home/gradle/src
COPY . .
RUN gradle shadowJar --no-daemon

# --- Stage 2: The Runner ---
# Use a lightweight and reliable JRE image from Eclipse Temurin
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy ONLY the built JAR file from the 'builder' stage
COPY --from=builder /home/gradle/src/build/libs/*-all.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]