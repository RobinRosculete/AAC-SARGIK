package com.sargik.angular;
import com.getcapacitor.BridgeActivity;

// google auth
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;



public class MainActivity extends BridgeActivity {
    // google auth
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        this.registerPlugin(GoogleAuth.class);
        super.onCreate(savedInstanceState);
    }
}
