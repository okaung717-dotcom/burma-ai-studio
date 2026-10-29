package com.burmaaistudio.app;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

@CapacitorPlugin(name = "AndroidAuth")
public class AndroidAuthPlugin extends Plugin {
    private static final String KEY_ALIAS = "burma_ai_studio_auth_v1";
    private static final String PREFS = "burma_ai_studio_secure_auth";
    private static final String SESSION = "encrypted_session";

    @PluginMethod
    public void saveSession(PluginCall call) {
        String value = call.getString("value");
        if (value == null) {
            call.reject("A session value is required.");
            return;
        }
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey());
            byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[cipher.getIV().length + encrypted.length];
            System.arraycopy(cipher.getIV(), 0, combined, 0, cipher.getIV().length);
            System.arraycopy(encrypted, 0, combined, cipher.getIV().length, encrypted.length);
            getContext().getSharedPreferences(PREFS, 0).edit()
                .putString(SESSION, Base64.encodeToString(combined, Base64.NO_WRAP))
                .apply();
            call.resolve();
        } catch (Exception error) {
            call.reject("Secure session storage failed.");
        }
    }

    @PluginMethod
    public void loadSession(PluginCall call) {
        JSObject result = new JSObject();
        String stored = getContext().getSharedPreferences(PREFS, 0).getString(SESSION, "");
        if (stored == null || stored.isEmpty()) {
            result.put("value", "");
            call.resolve(result);
            return;
        }
        try {
            byte[] combined = Base64.decode(stored, Base64.NO_WRAP);
            if (combined.length <= 12) throw new IllegalStateException("Invalid encrypted session");
            byte[] iv = Arrays.copyOfRange(combined, 0, 12);
            byte[] encrypted = Arrays.copyOfRange(combined, 12, combined.length);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, getOrCreateKey(), new GCMParameterSpec(128, iv));
            result.put("value", new String(cipher.doFinal(encrypted), StandardCharsets.UTF_8));
            call.resolve(result);
        } catch (Exception error) {
            getContext().getSharedPreferences(PREFS, 0).edit().remove(SESSION).apply();
            result.put("value", "");
            call.resolve(result);
        }
    }

    @PluginMethod
    public void clearSession(PluginCall call) {
        getContext().getSharedPreferences(PREFS, 0).edit().remove(SESSION).apply();
        call.resolve();
    }

    private SecretKey getOrCreateKey() throws Exception {
        KeyStore store = KeyStore.getInstance("AndroidKeyStore");
        store.load(null);
        if (store.containsAlias(KEY_ALIAS)) {
            return ((KeyStore.SecretKeyEntry) store.getEntry(KEY_ALIAS, null)).getSecretKey();
        }
        KeyGenerator generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        generator.init(new KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
        ).setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build());
        return generator.generateKey();
    }
}
