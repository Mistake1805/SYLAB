# ---- Build Stage ----
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build JAR
COPY src ./src
RUN mvn package -DskipTests -q

# ---- Runtime Stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# JVM tuning for Render Free Tier (512MB)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=60.0"

EXPOSE 8081
# Override lingering environment variables from old blueprints to guarantee correct JDBC format
ENTRYPOINT ["sh", "-c", "export SPRING_DATASOURCE_URL=\"jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}\" && java $JAVA_OPTS -jar app.jar"]
