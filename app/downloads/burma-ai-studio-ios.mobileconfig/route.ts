const profile = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key>
      <true/>
      <key>IsPrecomposed</key>
      <true/>
      <key>IsRemovable</key>
      <true/>
      <key>Label</key>
      <string>Burma AI Studio</string>
      <key>PayloadDescription</key>
      <string>Adds Burma AI Studio to the iPhone Home Screen in app mode.</string>
      <key>PayloadDisplayName</key>
      <string>Burma AI Studio</string>
      <key>PayloadIdentifier</key>
      <string>com.burmaaistudio.webclip</string>
      <key>PayloadType</key>
      <string>com.apple.webClip.managed</string>
      <key>PayloadUUID</key>
      <string>9C80EFD7-515D-46F3-91BF-72E7CBEC14B4</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>URL</key>
      <string>https://burmaaistudio.com/?source=pwa&amp;platform=ios</string>
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>Install Burma AI Studio as an iOS Home Screen app icon.</string>
  <key>PayloadDisplayName</key>
  <string>Burma AI Studio iOS Config</string>
  <key>PayloadIdentifier</key>
  <string>com.burmaaistudio.mobileconfig</string>
  <key>PayloadOrganization</key>
  <string>Burma AI Studio</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>F4B70D6A-0B86-43BD-9DB2-325C3F0E47E3</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;

export function GET() {
  return new Response(profile, {
    headers: {
      "Content-Type": "application/x-apple-aspen-config",
      "Content-Disposition": 'inline; filename="burma-ai-studio-ios.mobileconfig"',
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
