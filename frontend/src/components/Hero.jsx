function Hero() {
  return (
    <section className="hero">
      <div className="hero-section">
        <h1>CRUD Assignment Dashboard</h1>
        <p>
          This frontend is for our previous backend assignment with Users,
          Products, and Orders APIs.
        </p>
        <button>Backend: http://localhost:3000</button>
      </div>
      <div className="hero-image">
        <img
          src="https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg"
          alt="API dashboard"
        />
      </div>
    </section>
  );
}

export default Hero;
