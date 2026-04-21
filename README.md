# SignBridge

A sign language translator mobile app with accessibility at its core. Built
with **React Native + Expo** (SDK 54, TypeScript, expo-router).

SignBridge gives Deaf, hard-of-hearing, DeafBlind, and hearing users a shared
surface for real-time communication: camera-based sign detection, voice-to-sign
animation, structured learning, two-way conversations, and deep accessibility
controls.

## Features

### 1. Real-time sign language detection
- Camera preview via `expo-camera` with front / rear toggle
- Pluggable `SignClassifier` interface — ships with a `MockClassifier` and a
  clear integration seam for TensorFlow Lite / MediaPipe models
- Confidence scoring with alternates
- Continuous sentence buffer (not just single-word recognition)
- Per-detection haptic feedback and spoken descriptions

### 2. Voice-to-sign animation
- Voice input via `expo-av` recording + pluggable transcriber
- Multi-language spoken input (English, Hindi, Fijian, Spanish, UK)
- Animated avatar stage (`SignAvatar`) with cue-driven playback — swap in a
  3D glTF rig without touching the gloss protocol
- Customizable style, skin tone, and signing speed (0.5x – 1.5x)
- Phonetic breakdown for long words
- Regional sign-language selection (ASL, BSL, ISL, FSL, Auslan, LSF)
- Unknown words fall back to gloss-based fingerspelling

### 3. Accessibility for blind users
- Voice navigation hook with configurable voice commands
- `expo-haptics` feedback patterns (selection, light/medium/heavy, success/warning/error)
- `expo-speech` audio descriptions of detected signs
- Screen reader (TalkBack / VoiceOver) announcements via `AccessibilityInfo`
- Reduce-motion honoring both user setting and system flag
- Dedicated high-contrast theme + dark mode + system theme

### 4. Learn & practice
- Structured lessons per sign language with step-by-step guidance
- Practice sessions with real-time feedback via the detector
- Progress tracking, accuracy per lesson, achievement badges
- Difficulty filter: beginner / intermediate / advanced
- Deterministic daily challenge

### 5. Two-way conversation
- Persistent conversation history with timestamps
- Voice and signing turns in a single thread
- Categorized quick-phrase library (greeting / need / medical / travel / social)
- Emergency phrases with severity + haptic + spoken alert
- Context-aware suggestions driven by the latest turn

### 6. Personalization
- Preferred sign language + spoken language per profile
- Custom gesture library with description/metadata
- UI controls: font scale (85–150%), theme mode, haptics, audio, screen reader announcements
- Personalized vocabulary ranked by usage frequency

## Project layout

```
app/                         expo-router entrypoints
  _layout.tsx                Providers + root Stack
  (tabs)/                    Bottom-tab navigator
    index.tsx                Home
    detect.tsx               Real-time detection
    speak.tsx                Voice-to-sign avatar
    learn.tsx                Lessons + badges
    chat.tsx                 Two-way conversation
    profile.tsx              Accessibility, profile, custom gestures
  lesson/[id].tsx            Lesson detail
  practice/[id].tsx          Practice with live camera
  conversation/[id].tsx      Conversation detail + history list
src/
  components/                Reusable UI (Screen, Card, Chip, ConfidenceBar, SignAvatar, …)
  context/                   Accessibility, UserProfile, Conversation providers
  hooks/                     useSignDetection, useVoiceCommands
  services/
    signClassifier/          Pluggable classifier interface + mock
    voice/                   TTS + STT wrappers
    storage.ts               AsyncStorage helpers
  data/                      Lesson, phrase, and language catalogues
  theme/                     Light / dark / high-contrast palettes
  utils/                     phonetics, gloss conversion
  i18n/                      Bundled translations + locale detection
  types/                     Shared TypeScript types
```

## Running locally

```bash
npm install
npx expo start            # scan the QR with Expo Go, or press i / a / w
```

You'll need:
- Node 20+
- Expo Go (iOS/Android) or the platform toolchain for a dev build
- A device with a camera for the Detect/Practice screens

## Plugging in a real ML model

`src/services/signClassifier` defines the interface the UI depends on. To wire
up a real model:

1. Create a new class that implements `SignClassifier` (e.g. `TFLiteClassifier`)
2. Pass a configured instance into `useSignDetection` via `setClassifier`
3. Keep the sentence buffer management in your classifier for continuous
   recognition — the UI just renders what the classifier returns

The same pattern applies to STT: call `setTranscriber(fn)` in your app
bootstrap to enable voice commands and the Voice-to-Sign transcription flow.

## Commands

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm start           # expo start
```
