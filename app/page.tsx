import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Activities from './components/Activities';
import Footer from './components/Footer';

// Inspect the components rendered by the App component (Header, Hero, About, Activities, Footer) for potential hydration issues.
// Specifically look for client components, the use of hooks (like useState or useEffect), and any direct DOM manipulation
function Home() {
  return (
    <div className="min-h-screen bg-white">
       <Header />
      <main className="pt-16">
        <Hero />
        <About />
        <Activities />
      </main>
      <Footer /> 
    </div>
  );
}

export default Home;