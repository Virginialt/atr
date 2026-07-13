import React from 'react';
import logoImage from '../assets/img/logoatr.png';

function Header({ onBack, rightContent, style }) {
  return (
    <div className="header" style={style}>
      <img src={logoImage} alt="Logo ATR" className="header-logo" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {rightContent}
        {onBack && (
          <button onClick={onBack} className="header-btn" title="Volver">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
