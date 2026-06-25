# Burma AI Studio Mobile App Build Guide

This project can become a mobile app in three stages.

## Stage 1 — PWA install-ready website
Already added:
- `app/manifest.ts`
- `public/mobile-icon.svg`
- mobile app metadata in `app/layout.tsx`

This lets modern browsers understand the site as an installable app-style experience.

## Stage 2 — Android Play Store app
Recommended path: Android Trusted Web Activity or Capacitor wrapper.

Required owner accounts/tools:
- Google Play Console developer account
- Android Studio
- A release signing key
- Store listing graphics, screenshots, privacy policy, app description

Package suggestion:
- App name: Burma AI Studio
- Package ID: `com.burmaaistudio.app`
- Start URL: `https://burmaaistudio.com/`
- Theme color: `#911923`

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
A simple website-only WebView can be rejected, especially on iOS. The app should provide clear app value: fast mobile UX, contact actions, portfolio viewing, saved project inquiry flow, push/contact handoff, or admin-monitored chat.

## Store content draft
Short description:
Burma AI Studio helps businesses create AI promotional videos, cinematic ads, product ads, and Reels/TikTok short videos.

Full description:
Burma AI Studio is an AI video creation service for brands and businesses. Use the app to explore example videos, request project guidance, contact the team, and plan AI presenter videos, cinematic ads, product ads, music promos, hotel or restaurant ads, and social media short videos.

Privacy policy URL:
https://burmaaistudio.com/privacy-policy

Support/contact:
Email: okaung717@gmail.com
Phone: 09671010011
Telegram/Viber: +95 9 671 010 011
