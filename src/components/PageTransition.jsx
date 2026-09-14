// ==========================================
// PAGE TRANSITION COMPONENT
// Blur + Fade + Occlusion Effect
// ==========================================

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children, variant = 'occlusion' }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('exit');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
        window.scrollTo(0, 0);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  const getAnimationClass = () => {
    if (transitionStage === 'exit') {
      return 'page-exit';
    }

    switch (variant) {
      case 'zoom':
        return 'page-zoom-in';
      case 'slide-right':
        return 'page-slide-right';
      case 'slide-left':
        return 'page-slide-left';
      case 'slide-up':
        return 'page-slide-up';
      case 'occlusion':
      default:
        return 'page-occlusion';
    }
  };

  return (
    <div
      className={`page-transition-wrapper ${getAnimationClass()}`}
      key={displayLocation.pathname}
    >
      {children}
    </div>
  );
};

export default PageTransition;