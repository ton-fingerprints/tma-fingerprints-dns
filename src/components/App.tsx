import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';

import { routes } from '@/navigation/routes.tsx';

import TgRedirector from "@/components/TgRedirector";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export function App() {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios', 'android', 'linux', 'windows', "tdesktop", "web"].includes(lp.platform) ? 'ios' : 'base'}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(28,28,30,1) 100%)"
          : "var(--tg-theme-bg-secondary-color)",
      }}
    >
      <Header/>
      <HashRouter>
        <TgRedirector />
        <Routes>
          {routes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
      <Footer/>
    </AppRoot>
  );
}
