package de.bsdex.capacitor.amplitude;

import com.amplitude.android.Amplitude;
import com.amplitude.android.Configuration;
import com.amplitude.core.ServerZone;
import com.amplitude.core.events.BaseEvent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@CapacitorPlugin(name = "AmplitudeAnalytics")
public class AmplitudeAnalyticsPlugin extends Plugin {

    private Amplitude amplitude;

    @PluginMethod()
    public void init(PluginCall call) {
        String apiKey = call.getString("apiKey");
        if (apiKey == null || apiKey.isEmpty()) {
            call.reject("Missing apiKey");
            return;
        }

        if (amplitude != null) {
            call.resolve();
            return;
        }

        String serverZoneStr = call.getString("serverZone", "US");
        ServerZone zone = "EU".equals(serverZoneStr) ? ServerZone.EU : ServerZone.US;

        Configuration config = new Configuration(apiKey, getContext().getApplicationContext());
        config.setServerZone(zone);

        amplitude = new Amplitude(config);
        call.resolve();
    }

    @PluginMethod()
    public void setUserId(PluginCall call) {
        String userId = call.getString("userId");
        if (amplitude != null) {
            amplitude.setUserId(userId);
        }
        call.resolve();
    }

    @PluginMethod()
    public void track(PluginCall call) {
        String eventType = call.getString("eventType");
        if (eventType == null || eventType.isEmpty()) {
            call.reject("Missing eventType");
            return;
        }

        if (amplitude == null) {
            call.reject("Amplitude not initialized. Call init() first.");
            return;
        }

        BaseEvent event = new BaseEvent();
        event.eventType = eventType;

        JSObject props = call.getObject("eventProperties");
        if (props != null) {
            Map<String, Object> propsMap = new HashMap<>();
            Iterator<String> keys = props.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                try {
                    propsMap.put(key, props.get(key));
                } catch (Exception e) {
                    // skip unparseable values
                }
            }
            event.setEventProperties(propsMap);
        }

        amplitude.track(event);
        call.resolve();
    }

    @PluginMethod()
    public void reset(PluginCall call) {
        if (amplitude != null) {
            amplitude.reset();
        }
        call.resolve();
    }
}
