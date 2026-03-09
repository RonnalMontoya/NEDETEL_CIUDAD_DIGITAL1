package com.nedetel.ciudaddigital;

import android.os.Bundle;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if (getBridge() != null && getBridge().getWebView() != null) {
			getBridge().getWebView().setLayerType(View.LAYER_TYPE_SOFTWARE, null);
		}
	}
}
