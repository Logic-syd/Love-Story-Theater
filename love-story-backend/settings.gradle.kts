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