package com.burmaaistudio.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(AndroidAuthPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
