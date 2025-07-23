plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}

rootProject.name = "love-story-backend"

toolchainManagement {
    jvm {
        javaRepositories {
            repository("foojay") {
                resolverClass.set(org.gradle.jvm.toolchain.foojay.FoojayToolchainResolver::class.java)
            }
        }
    }
}