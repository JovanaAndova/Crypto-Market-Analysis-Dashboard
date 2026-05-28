# ======================
# BUILD STAGE
# ======================
FROM maven:3.9-eclipse-temurin-23 AS build
WORKDIR /app

# cache dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

# build app
COPY src src
RUN ./mvnw -DskipTests package

# ======================
# RUN STAGE
# ======================
FROM eclipse-temurin:23-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
