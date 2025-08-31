import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Activities from './components/Activities';
import MissionVision from './components/MissionVision';
import Gallery from './components/Gallery';
import Contact from './components/Contact';

// Inspect the components rendered by the App component (Header, Hero, About, Activities, Footer) for potential hydration issues.
// Specifically look for client components, the use of hooks (like useState or useEffect), and any direct DOM manipulation
function Home() {
  return (
    <main className="pt-16">
      <Hero />
      <About />
      <MissionVision />
      <Activities />
      <Gallery />
      <Contact />
    </main>
  );
}

export default Home;