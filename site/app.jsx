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
      <Testimonials />
      <Pricing />
      <FAQ />
      <BigCTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Site />);
