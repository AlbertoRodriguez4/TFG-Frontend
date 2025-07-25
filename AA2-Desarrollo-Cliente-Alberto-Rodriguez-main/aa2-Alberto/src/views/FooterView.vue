<template>
    <footer class="footer">
      <p>©The Training Hub</p>
      <img src="../assets/imgs/Logo.png" alt="Logo" class="logo" />
      <div class="social">
        <img src="../assets/imgs/twitter.png" alt="Twitter" class="rrss" />
        <img src="../assets/imgs/facebook.png" alt="Facebook" class="rrss" />
        <img src="../assets/imgs/instagram.png" alt="Instagram" class="rrss" />
        <img src="../assets/imgs/tik-tok.png" alt="TikTok" class="rrss" />
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background: white;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    align-items: center;
    border-top: 1px solid #ddd;
    height: 13%;
  }
  
  .footer .social img {
    width: 50px;
    margin-left: 0.5rem;
    cursor: pointer;
  }
  
  .social {
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    width: 20%;
    padding-right: 1.5rem; 
  }
  
  .logo {
    width: 150px;
    height: 150px;
  }
  
  p {
    text-align: center;
    font-size: 1.75rem;
    font-weight: bold;
    color: black;
  }
  </style>
  