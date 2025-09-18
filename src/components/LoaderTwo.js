const LoaderTwo = ({ text }) => (
  <div className="loader-backdrop">
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">{text}</p>
    </div>
    <style jsx>{`
      .loader-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        flex-direction: column;
      }
      .loader-container {
        text-align: center;
        color: #fff;
      }
      .spinner {
        margin: 0 auto 20px;
        width: 50px;
        height: 50px;
        border: 6px solid rgba(255, 255, 255, 0.3);
        border-top-color: #00ffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      .loader-text {
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        animation: blink 1.5s infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0.4; }
      }
    `}</style>
  </div>
);

export default LoaderTwo;
