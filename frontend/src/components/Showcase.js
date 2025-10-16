import React from 'react';
import './Showcase.css';

function Showcase() {
  return (
    <div className="showcase">
      {/* Sticky Navigation */}
      <nav className="sticky-nav">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#demo">Demo</a></li>
          <li><a href="#team">Team</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>DiaBite: Smart Diabetes Management</h1>
          <p className="hero-subtitle">
            An intuitive platform to track, analyze, and manage diabetes with AI-powered insights.
          </p>
          <a href="#demo" className="cta-button">Watch Demo</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16"/></svg>
            </div>
            <h3>Dashboard</h3>
            <p>A comprehensive overview of your health metrics.</p>
          </div>
          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m6-6H6"/></svg>
            </div>
            <h3>Food Tracking</h3>
            <p>Log your meals and get instant nutritional feedback.</p>
          </div>
          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4m0 16v-4m8-8h-4m-8 0H4m16 8v-2m-4-2h-2m-4 0H8m-2-2v-2m4 4h2m0 4v2m-4-2h-2m-2-2H4"/></svg>
            </div>
            <h3>AI Recommendations</h3>
            <p>Personalized suggestions to improve your health.</p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <h2 className="section-title">Project Demo</h2>
        <div className="video-container">
          {/* In a real project, you would replace this with an embedded video */}
          <div className="video-placeholder">
            <p>Video demo coming soon!</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="team-grid">
          {/* Team Member 1 */}
          <div className="team-member-card">
            <div className="team-member-photo"></div>
            <h3>T. Hemanth</h3>
            <p>Project coordination, Backend development, AI integration</p>
          </div>
          {/* Team Member 2 */}
          <div className="team-member-card">
            <div className="team-member-photo"></div>
            <h3>N. Sanjay</h3>
            <p>UI/UX design, AI recommendation system implementation</p>
          </div>
          {/* Team Member 3 */}
          <div className="team-member-card">
            <div className="team-member-photo"></div>
            <h3>P. Nikhita</h3>
            <p>Documentation, quality assurance</p>
          </div>
          {/* Team Member 4 */}
          <div className="team-member-card">
            <div className="team-member-photo"></div>
            <h3>P. Jithamanyu</h3>
            <p>UI/UX design, frontend development</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="showcase-footer">
        <p>&copy; 2024 DiaBite. All rights reserved.</p>
        <div className="footer-links">
          <a href="https://github.com/your-repo/diabite" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
        </div>
      </footer>
    </div>
  );
}

export default Showcase;
