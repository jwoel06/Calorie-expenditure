import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Your <span className="gradient-text">Fitness Journey</span>
          </h1>
          <p className="hero-subtitle">
            Our company sets to make estimating your caloric expenditure during workouts easy and efficient.
          </p>
          <div className="hero-buttons">
            <a href="/calculate" className="cta-button primary">
              Start Calculating
            </a>
            <a href="/register" className="cta-button secondary">
              Join Now
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-icon">🔥</div>
            <h3>2,450</h3>
            <p>Calories Burned</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose GoSally?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>See How Many Calories You Burn Each Week</h3>
              <p>
                Track your weekly caloric burn with detailed analytics and beautiful visualizations. 
                Monitor your progress and stay motivated with comprehensive weekly reports.
              </p>
              <a href="/calculate" className="feature-link">
                Start Tracking →
              </a>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Earn Medals</h3>
              <p>
                Unlock achievements and earn medals as you hit your fitness milestones. 
                Celebrate your victories with our gamified reward system.
              </p>
              <div className="medal-preview">
                <span className="medal">🥇</span>
                <span className="medal">🥈</span>
                <span className="medal">🥉</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Find Your Coach</h3>
              <p>
                Connect with certified fitness coaches who can guide your journey. 
                Get personalized workout plans and expert advice tailored to your goals.
              </p>
              <a href="/register" className="feature-link">
                Find Coaches →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50K+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>1M+</h3>
              <p>Workouts Tracked</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Certified Coaches</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Fitness Journey?</h2>
          <p>Join thousands of users who have transformed their lives with GoSally</p>
          <div className="cta-buttons">
            <a href="/register" className="cta-button primary large">
              Get Started Free
            </a>
            <a href="/calculate" className="cta-button secondary large">
              Try Calculator
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;