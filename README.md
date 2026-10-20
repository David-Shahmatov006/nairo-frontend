# 🌐 Nairo — AI-Powered Social Platform

Frontend for **Nairo**, an **AI-powered social networking platform** that brings content creation, people discovery, and real-time conversations into one experience. Built with **React 19**, **TypeScript**, and **Vite**, with a **Google Gemini-powered AI agent** provided by the Nairo backend.

## 🤖 AI Experience

- **Nairo AI Agent** — an in-app conversational assistant that finds users and retrieves their posts using real platform data.
- **Conversation context** — follow-up questions can refer to earlier answers, including choices from a list of users.
- **Interface actions** — ask the agent to switch between light and dark themes, change to a supported interface language, or open the post editor.
- **AI-assisted writing** — improve text or generate a post from an idea, optionally with an AI-generated image. Generated content can be reviewed in the editor before publishing.
- **Persistent conversations** — messages and drafts are saved in localStorage separately for each account. The clear-history button also removes the backend conversation cache.
- **Rich responses** — Markdown formatting, clickable post/profile links, lists, tables, and code blocks.

AI requests run through the authenticated backend API; Gemini credentials are never needed in the frontend. The browser executes supported structured actions through `src/utils/executeAgentActions.ts`.

### Local development

```bash
yarn install
```

Create a local `.env` file:

```dotenv
VITE_API_URL=http://localhost:5001
```

```bash
yarn dev       # Vite development server
yarn build     # TypeScript checks and production build
yarn lint
yarn test
```

Run the Nairo backend alongside the frontend for authentication, AI features, and messaging. The development frontend normally runs at `http://localhost:5173`.

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

### AI Response Rendering

- react-markdown
- remark-gfm
- Structured interface actions through the backend AI API

### Icons

- React Icons

### Utilities


- date-fns
- react-scroll-to-bottom
- react-infinite-scroll-component

---

## 📱 Responsive Breakpoints

- Mobile
- Tablet
- Desktop
- 2K / Ultra-wide monitors

---

## 🎯 Highlights

- ✅ AI-powered social experience with a conversational assistant
- ✅ AI-assisted text, post, and image generation
- ✅ Agent-driven theme, language, and editor actions
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
