import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <div className="title">
        <NavBar />
        <h1>Ulstein Service performance under demanding weather conditions</h1>
        <p>Comparison of serviceability of wind turbines under varying weather conditions</p>
      </div>
      <div className="container">
        <div className="box top-box">
          <span role="img" aria-label="wrench">🔧</span> Under Development
        </div>
        <div className="bottom-boxes">
          <div className="box bottom-box">
            <span role="img" aria-label="wrench">🔧</span> Under Development
          </div>
          <div className="box bottom-box">
            <span role="img" aria-label="wrench">🔧</span> Under Development
          </div>
        </div>
      </div>
    </div>
  );
}

// Change the reference later
function NavBar() {
  return (
    <nav className="navbar">
      <a href="#home" className="nav-link">Home</a>
      <a href="#about-us" className="nav-link">About Us</a>
    </nav>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


const style = document.createElement('style');
style.textContent = `
  .navbar {
    display: flex;
    justify-content: flex-end;
    padding: 1.5rem;
    background-color: #f0f0f0;
  }
  .nav-link {
    text-decoration: none;
    color: black;
    font-weight: bold;
    margin-left: 1.5rem;
  }
  .nav-link:hover {
    color: #007BFF;
  }
  .title {
    text-align: center;
    margin-top: 2rem;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }
  .box {
    background-color: #e0e0e0;
    border: 1px solid #ccc;
    padding: 2rem;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top-box {
    width: 80%;
    margin-bottom: 2rem;
  }
  .bottom-boxes {
    display: flex;
    justify-content: space-between;
    width: 80%;
  }
  .bottom-box {
    width: 50%;
  }
`;
document.head.appendChild(style);
