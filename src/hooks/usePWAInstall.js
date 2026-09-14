// ==========================================
// PWA INSTALL HOOK
// FULLY FIXED: Show button in dev mode + auto-hide after install
// ==========================================

import { useState, useEffect, useCallback } from 'react';

export const usePWAInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDevMode] = useState(import.meta.env.DEV);

  // ==========================================
  // CHECK IF APP IS ALREADY INSTALLED
  // ==========================================
  const checkIfInstalled = useCallback(() => {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;

    const isIOSStandalone = window.navigator.standalone === true;

    const isAndroidTWA =
      document.referrer.includes('android-app://');

    const isCapacitor =
      window.Capacitor?.isNativePlatform?.() === true;

    const isSavedInstalled =
      localStorage.getItem('weatherwise_installed') === 'true';

    const installed =
      isStandalone ||
      isIOSStandalone ||
      isAndroidTWA ||
      isCapacitor ||
      isSavedInstalled;

    console.log('🔍 PWA Install Check:');
    console.log('   Standalone:', isStandalone);
    console.log('   iOS Standalone:', isIOSStandalone);
    console.log('   Android TWA:', isAndroidTWA);
    console.log('   Capacitor:', isCapacitor);
    console.log('   Saved flag:', isSavedInstalled);
    console.log('   → Is Installed:', installed);

    return installed;
  }, []);

  // ==========================================
  // INITIAL CHECK + EVENT LISTENERS
  // ==========================================
  useEffect(() => {
    const installed = checkIfInstalled();
    setIsInstalled(installed);

    // ==========================================
    // beforeinstallprompt
    // ==========================================
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('✅ PWA is installable');
    };

    // ==========================================
    // appinstalled
    // ==========================================
    const handleAppInstalled = () => {
      console.log('✅ PWA installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('weatherwise_installed', 'true');
    };

    // ==========================================
    // display-mode change
    // ==========================================
    const mediaQuery = window.matchMedia(
      '(display-mode: standalone)'
    );

    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        console.log('✅ Entered standalone mode');
        setIsInstalled(true);
        setIsInstallable(false);
        localStorage.setItem('weatherwise_installed', 'true');
      }
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall
    );
    window.addEventListener('appinstalled', handleAppInstalled);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleDisplayModeChange);
    }

    // ==========================================
    // PERIODIC CHECK
    // ==========================================
    const interval = setInterval(() => {
      const installed = checkIfInstalled();
      if (installed && !isInstalled) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    }, 2000);

    // ==========================================
    // DEV MODE FALLBACK
    // Force show button in dev
    // ==========================================
    if (import.meta.env.DEV && !installed) {
      console.log('🔧 Dev mode: Forcing install button visible');
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall
      );
      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(
          'change',
          handleDisplayModeChange
        );
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleDisplayModeChange);
      }

      clearInterval(interval);
    };
  }, [checkIfInstalled, isInstalled]);

  // ==========================================
  // TRIGGER INSTALL
  // ==========================================
  const triggerInstall = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('⚠️ Install prompt not available');

      // Fallback: Manual instructions
      alert(
        '📱 To install WeatherWise:\n\n' +
          'Chrome/Edge: Menu (⋮) → "Install App" or "Add to Home Screen"\n\n' +
          'Safari (iOS): Share → "Add to Home Screen"'
      );
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log('👤 User choice:', outcome);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        localStorage.setItem('weatherwise_installed', 'true');
      }

      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (err) {
      console.error('❌ Install prompt error:', err);
      return false;
    }
  }, [deferredPrompt]);

  // ==========================================
  // SHOULD SHOW INSTALL BUTTON
  // ==========================================
  const shouldShowInstallButton =
    !isInstalled && (isInstallable || isDevMode);

  return {
    isInstalled,
    isInstallable,
    shouldShowInstallButton,
    triggerInstall,
  };
};

export default usePWAInstall;