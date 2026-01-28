import "./Header.css";
import carwale from "../../assets/carwale.png";

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        
        <div className="logo">
          <img
            src={carwale}
            alt="carwale"
          />
        </div>

       
        <nav className="nav-links">
          <a href="#">NEW CARS</a>
          <a href="#">USED CARS</a>
          <a href="#">REVIEWS & NEWS</a>
        </nav>

     
        <div className="header-actions">
          <div className="search-box">
            <input placeholder="Search" />
            <span className="search-icon">🔍</span>
          </div>

          <span className="icon">📍</span>
          <span className="icon">👤</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
