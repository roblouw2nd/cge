// Site composition.

function Site() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Manifesto />
      <Services />
      <Method />
      <CaseSpotlight />
      <Stack />
      <Thinking />
      <About />
      <Pricing />
      <FAQ />
      <BigCTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Site />);
