package com.sargik.angular;
import android.os.Bundle; 
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        this.registerPlugin(GoogleAuth.class);

        super.onCreate(savedInstanceState);
    }
}
