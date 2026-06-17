import Hero from "./components/Hero";
import "./index.css";
import About from "./components/About";

function App() {
  return (
    <div className="App">
      <header className="page-header">
        <p>Placement Training</p>
      </header>
      <Hero />
      <About />
    </div>
  );
}

export default App;
