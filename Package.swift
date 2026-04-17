// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorAmplitude",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "CapacitorAmplitude",
            targets: ["CapacitorAmplitude"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/amplitude/Amplitude-Swift.git", from: "1.0.0"),
    ],
    targets: [
        .target(
            name: "CapacitorAmplitude",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "AmplitudeSwift", package: "Amplitude-Swift"),
            ],
            path: "ios/Sources/CapacitorAmplitude"
        ),
    ]
)
