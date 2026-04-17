import Foundation
import Capacitor
import AmplitudeSwift

@objc(AmplitudeAnalytics)
public class AmplitudeAnalyticsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AmplitudeAnalytics"
    public let jsName = "AmplitudeAnalytics"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "init", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setUserId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "track", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "reset", returnType: CAPPluginReturnPromise),
    ]

    private var amplitude: Amplitude?

    @objc func `init`(_ call: CAPPluginCall) {
        guard let apiKey = call.getString("apiKey"), !apiKey.isEmpty else {
            call.reject("Missing apiKey")
            return
        }

        if amplitude != nil {
            call.resolve()
            return
        }

        let serverZoneString = call.getString("serverZone") ?? "US"
        let serverZone: ServerZone = serverZoneString == "EU" ? .EU : .US

        let logLevelString = call.getString("logLevel") ?? "ERROR"
        let logLevel: LogLevelEnum
        switch logLevelString {
        case "OFF": logLevel = .OFF
        case "WARN": logLevel = .WARN
        case "INFO": logLevel = .INFO
        case "DEBUG": logLevel = .DEBUG
        default: logLevel = .ERROR
        }

        let config = Configuration(
            apiKey: apiKey,
            logLevel: logLevel,
            serverZone: serverZone
        )
        amplitude = Amplitude(configuration: config)
        call.resolve()
    }

    @objc func setUserId(_ call: CAPPluginCall) {
        // userId can be explicitly null to clear
        let userId: String? = call.getString("userId")
        amplitude?.setUserId(userId: userId)
        call.resolve()
    }

    @objc func track(_ call: CAPPluginCall) {
        guard let eventType = call.getString("eventType"), !eventType.isEmpty else {
            call.reject("Missing eventType")
            return
        }

        let properties = call.getObject("eventProperties")
        let event = BaseEvent(eventType: eventType)
        if let props = properties {
            var eventProps: [String: Any] = [:]
            for (key, value) in props {
                eventProps[key] = value
            }
            event.eventProperties = eventProps
        }
        amplitude?.track(event: event)
        call.resolve()
    }

    @objc func reset(_ call: CAPPluginCall) {
        amplitude?.reset()
        call.resolve()
    }
}
