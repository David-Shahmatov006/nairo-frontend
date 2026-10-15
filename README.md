# 🌐 Nairo Frontend

A modern social networking platform built with **React**, **TypeScript**, and **Vite**, focused on performance, user experience, and scalability.

## Seasonal themes

Change `SEASONAL_THEME` in `src/constants/seasonalTheme.ts`:

```ts
export const SEASONAL_THEME: SeasonalThemeId = "halloween";
```

- `"off"` — original Nairo.
- `"halloween"` — seasonal mascot costumes, occasional flying bats and a corner web.
- `"christmas"` — seasonal mascot costumes, lights on the welcome banner and the existing `Snowfall` component.
- `"valentine"` — seasonal mascot costumes.

Holidays preserve the original light/dark backgrounds, panels and accent color.
Mascots only change in places where the original app already shows them.
The existing light/dark toggle works with every holiday. During development,
Vite reloads the theme after saving; production needs a rebuild/deploy.
Decoration styles live in `src/styles/seasonal.css`; the components live in
`src/components/SeasonalTheme`. Mascot sheets are stored in
`src/assets/images/seasonal-mascots/`.
Animations respect `prefers-reduced-motion` and never intercept clicks.

## 🔗 Links

- 🌍 **Live Demo:** https://nairo-frontend-production.up.railway.app/

## ✨ Features

- 🔐 Authentication & Authorization
  - Registration
  - Login
  - OTP email verification
  - Password recovery
  - Secure authentication with cookies

- 👤 User Profiles
  - Edit profile information
  - Upload avatar
  - Bio support
  - Follow / Unfollow users
  - User search

- 📝 Posts
  - Create posts with images
  - View post details
  - Comments
  - Save posts
  - Responsive post cards

- 💬 Real-Time Chat
  - Private conversations
  - Typing indicator
  - Automatic scroll to latest messages
  - Chat search
  - Delete chats

- 🌍 Internationalization (i18n)
  - Multi-language support
  - Ukrainian
  - English
  - Polish
  - Turkish
  - Italian
  - Portuguese
  - Japanese
  - French
  - German
  - Spanish
  - Easy to add new languages

- 🎨 Themes
  - Light Mode
  - Dark Mode

- 📱 Responsive Design
  - Mobile-first approach
  - Tablet support
  - Desktop optimization
  - Ultra-wide screen support

- ⚡ Performance
  - Lazy loading
  - Optimized images
  - Infinite scrolling
  - Efficient rendering

- 😊 UI/UX
  - Smooth animations with Framer Motion
  - Emoji picker
  - Beautiful loading states
  - Custom scrollbars

---

## 🛠️ Tech Stack

### Core

- React 19
- TypeScript
- Vite

### Routing

- React Router DOM

### Styling

- Tailwind CSS
- clsx

### State Management

- Zustand

### HTTP Client

- Axios
- SWR

### Internationalization

- i18next
- react-i18next

### Animations

- Framer Motion

### Realtime

- Socket.IO Client

### Notifications

- React Hot Toast

### Icons

- React Icons

### Utilities


- date-fns
- react-scroll-to-bottom
- react-intersection-observer
- react-infinite-scroll-component

---

## 📱 Responsive Breakpoints

- Mobile
- Tablet
- Desktop
- 2K / Ultra-wide monitors

---

## 🎯 Highlights

- ✅ Fully responsive UI
- ✅ Dark & Light themes
- ✅ Multi-language support(10 languages)
- ✅ Real-time messaging
- ✅ Infinite scrolling
- ✅ Secure authentication
- ✅ Optimized performance
- ✅ Reusable component architecture
- ✅ Modern React patterns
- ✅ Clean and scalable codebase

---

## 📄 License

This project is created for educational and portfolio purposes.
