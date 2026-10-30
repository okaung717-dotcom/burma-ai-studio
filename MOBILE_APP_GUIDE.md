# Burma AI Studio Mobile App Build Guide

This project can become a mobile app in three stages.

## Stage 1 — PWA install-ready website
Already added:
- `app/manifest.ts`
- `public/burma-ai-icon.svg`
- mobile app metadata in `app/layout.tsx`

This lets modern browsers understand the site as an installable app-style experience.

## Stage 2 — Android Play Store app
The existing Android wrapper in `native-app` is preserved. Its authentication
bridge and build workflow remain the compatibility baseline for future releases.

Required owner accounts/tools:
- Google Play Console developer account
- Android Studio
- A release signing key
- Store listing graphics, screenshots, privacy policy, app description

Package suggestion:
- App name: Burma AI Studio
- Package ID: `com.burmaaistudio.app`
- Start URL: `https://burmaaistudio.com/`
- Theme color: `#08090c`

Play Store output:
- Android App Bundle `.aab`

## Stage 3 — iOS App Store app
Recommended path: Capacitor iOS wrapper with real app value and native polish.

Required owner accounts/tools:
- Apple Developer Program account
- Mac with Xcode
- App Store Connect access
- App icon PNG sizes
- Screenshots for iPhone/iPad
- Privacy policy and data collection answers

Bundle ID suggestion:
- `com.burmaaistudio.app`

## Important App Store note
A simple website-only WebView can be rejected, especially on iOS. The app should
provide clear app value through its node canvas, saved creative workflows, private
asset library, and secure generation-job experience.

## Store content draft
Short description:
Burma AI Studio is a private AI image and video creative workspace.

Full description:
Burma AI Studio brings image generation, video generation, AI direction, reusable
assets, and connected node-based workflows into one private creative workspace.

Privacy policy URL:
https://burmaaistudio.com/privacy-policy

Support/contact:
Email: okaung717@gmail.com
Phone: 09671010011
Telegram/Viber: +95 9 671 010 011
