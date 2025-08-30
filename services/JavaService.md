## Java Service Structure

### Option 1: Single Module Service (Recommended for Simple Microservices)

```
order-service/ (Java)
├── src/
│   ├── main/
│   │   ├── java/com/company/orderservice/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── config/
│   │   │   └── OrderServiceApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
└── test/
    └── java/com/company/orderservice/
        ├── controller/
        ├── service/
        └── integration/
├── pom.xml                        # Maven
├── build.gradle                   # or Gradle
├── gradle.properties              # Gradle properties
├── settings.gradle                # Gradle settings
├── gradlew                        # Gradle wrapper
├── gradlew.bat
├── gradle/
│   └── wrapper/
├── Dockerfile
└── README.md
```

### Option 2: Multi-Module Service (For Complex Services)

```
notification-service/ (Java)
├── notification-api/              # REST API module
│   ├── src/main/java/com/company/notification/api/
│   ├── src/test/java/
│   └── pom.xml
├── notification-core/             # Business logic
│   ├── src/main/java/com/company/notification/core/
│   ├── src/test/java/
│   └── pom.xml
├── notification-infrastructure/   # Data access & external services
│   ├── src/main/java/com/company/notification/infrastructure/
│   ├── src/test/java/
│   └── pom.xml
├── notification-shared/           # Shared utilities
│   ├── src/main/java/com/company/notification/shared/
│   └── pom.xml
├── pom.xml                       # Parent POM
├── settings.gradle               # For Gradle multi-project
└── README.md
```

### Key Java Files Explained

**Parent pom.xml (Maven Multi-Module)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.company</groupId>
    <artifactId>notification-service</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <modules>
        <module>notification-api</module>
        <module>notification-core</module>
        <module>notification-infrastructure</module>
        <module>notification-shared</module>
    </modules>
    
    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2023.0.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

**Child Module pom.xml (notification-api)**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.company</groupId>
        <artifactId>notification-service</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    
    <artifactId>notification-api</artifactId>
    <packaging>jar</packaging>
    
    <dependencies>
        <dependency>
            <groupId>com.company</groupId>
            <artifactId>notification-core</artifactId>
            <version>${project.version}</version>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

**settings.gradle (Gradle Multi-Project)**
```gradle
rootProject.name = 'notification-service'

include 'notification-api'
include 'notification-core'
include 'notification-infrastructure'
include 'notification-shared'
```

**Root build.gradle (Gradle)**
```gradle
plugins {
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
    id 'java'
}

allprojects {
    group = 'com.company'
    version = '1.0.0-SNAPSHOT'
    
    repositories {
        mavenCentral()
    }
}

subprojects {
    apply plugin: 'java'
    apply plugin: 'org.springframework.boot'
    apply plugin: 'io.spring.dependency-management'
    
    java {
        sourceCompatibility = '21'
        targetCompatibility = '21'
    }
    
    dependencies {
        implementation 'org.springframework.boot:spring-boot-starter'
        testImplementation 'org.springframework.boot:spring-boot-starter-test'
    }
    
    test {
        useJUnitPlatform()
    }
}
```


**Java Maven - build.sh**
```bash
#!/bin/bash
./mvnw clean compile
./mvnw test
./mvnw package -DskipTests
```

**Java Gradle - build.sh**
```bash
#!/bin/bash
./gradlew clean build
./gradlew test
./gradlew bootJar
```