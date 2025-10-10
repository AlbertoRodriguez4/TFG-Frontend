<template>
  <footer class="footer">
    <!-- Onda decorativa superior -->
    <div class="footer-wave">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M0,0 C150,80 350,0 600,50 C850,100 1050,20 1200,80 L1200,120 L0,120 Z" 
              class="wave-path"></path>
      </svg>
    </div>

    <div class="footer-content">
      <!-- Sección izquierda: Copyright -->
      <div class="footer-section copyright-section">
        <div class="brand-text">
          <span class="brand-icon">💪</span>
          <p class="copyright-text">©2025 The Training Hub</p>
        </div>
        <p class="tagline">Level Up Your Fitness Journey</p>
      </div>

      <!-- Sección central: Logo -->
      <div class="footer-section logo-section">
        <div class="logo-container">
          <div class="logo-glow"></div>
          <img src="../assets/imgs/Logo.png" alt="Logo" class="logo" />
        </div>
      </div>

      <!-- Sección derecha: Redes sociales -->
      <div class="footer-section social-section">
        <p class="social-title">Join Our Community</p>
        <div class="social">
          <a href="#" class="social-link twitter" aria-label="Twitter">
            <img src="../assets/imgs/twitter.png" alt="Twitter" class="rrss" />
            <span class="social-hover-bg"></span>
          </a>
          <a href="#" class="social-link facebook" aria-label="Facebook">
            <img src="../assets/imgs/facebook.png" alt="Facebook" class="rrss" />
            <span class="social-hover-bg"></span>
          </a>
          <a href="#" class="social-link instagram" aria-label="Instagram">
            <img src="../assets/imgs/instagram.png" alt="Instagram" class="rrss" />
            <span class="social-hover-bg"></span>
          </a>
          <a href="#" class="social-link tiktok" aria-label="TikTok">
            <img src="../assets/imgs/tik-tok.png" alt="TikTok" class="rrss" />
            <span class="social-hover-bg"></span>
          </a>
        </div>
      </div>
    </div>

    <!-- Barra inferior con links adicionales -->
    <div class="footer-bottom">
      <div class="footer-links">
        <a href="#" class="footer-link">Privacy Policy</a>
        <span class="separator">|</span>
        <a href="#" class="footer-link">Terms of Service</a>
        <span class="separator">|</span>
        <a href="#" class="footer-link">Contact Us</a>
      </div>
      <p class="made-with">Made with <span class="heart">❤️</span> for fitness lovers</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding-top: 0;
  overflow: hidden;
  margin-top: 4rem;
}

/* Onda decorativa */
.footer-wave {
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 60px;
  overflow: hidden;
  line-height: 0;
}

.footer-wave svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 60px;
}

.wave-path {
  fill: rgba(255, 255, 255, 0.95);
  animation: waveAnimation 10s ease-in-out infinite;
}

@keyframes waveAnimation {
  0%, 100% { d: path("M0,0 C150,80 350,0 600,50 C850,100 1050,20 1200,80 L1200,120 L0,120 Z"); }
  50% { d: path("M0,20 C150,60 350,20 600,70 C850,80 1050,40 1200,60 L1200,120 L0,120 Z"); }
}

/* Contenido principal del footer */
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 60px;
  position: relative;
}

/* Secciones del footer */
.footer-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Sección de copyright */
.copyright-section {
  align-items: flex-start;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

.brand-icon {
  font-size: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.copyright-text {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.tagline {
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
  font-style: italic;
  margin-left: 3rem;
}

/* Logo central */
.logo-section {
  position: relative;
}

.logo-container {
  position: relative;
  width: 140px;
  height: 140px;
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 8px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
  object-fit: cover;
}

.logo:hover {
  transform: scale(1.05) rotate(5deg);
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
  animation: logoGlow 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes logoGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Redes sociales */
.social-section {
  align-items: flex-end;
}

.social-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.social {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.social-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.social-link:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.social-hover-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link.twitter:hover .social-hover-bg {
  background: linear-gradient(135deg, #1DA1F2, #0d8bd9);
  opacity: 1;
}

.social-link.facebook:hover .social-hover-bg {
  background: linear-gradient(135deg, #4267B2, #365899);
  opacity: 1;
}

.social-link.instagram:hover .social-hover-bg {
  background: linear-gradient(135deg, #E1306C, #C13584, #833AB4);
  opacity: 1;
}

.social-link.tiktok:hover .social-hover-bg {
  background: linear-gradient(135deg, #000000, #fe2c55);
  opacity: 1;
}

.rrss {
  width: 28px;
  height: 28px;
  position: relative;
  z-index: 2;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.social-link:hover .rrss {
  transform: scale(1.1);
}

/* Barra inferior */
.footer-bottom {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.footer-link {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.footer-link:hover {
  opacity: 1;
  text-decoration: underline;
  transform: translateY(-1px);
}

.separator {
  opacity: 0.5;
  font-size: 0.8rem;
}

.made-with {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
}

.heart {
  color: #ff6b6b;
  animation: heartbeat 1.5s ease-in-out infinite;
  display: inline-block;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(1.2); }
  20%, 40% { transform: scale(1); }
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-content {
    padding: 2.5rem 2rem 1.5rem;
  }
  
  .footer-bottom {
    padding: 1.5rem 2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }
  
  .footer-section {
    align-items: center !important;
    width: 100%;
  }
  
  .copyright-section {
    text-align: center;
  }
  
  .brand-text {
    justify-content: center;
  }
  
  .tagline {
    margin-left: 0;
    text-align: center;
  }
  
  .social-section {
    align-items: center !important;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    text-align: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .copyright-text {
    font-size: 1.2rem;
  }
  
  .logo-container {
    width: 100px;
    height: 100px;
  }
  
  .social-link {
    width: 50px;
    height: 50px;
  }
  
  .rrss {
    width: 24px;
    height: 24px;
  }
  
  .footer-link {
    font-size: 0.85rem;
  }
}
</style>