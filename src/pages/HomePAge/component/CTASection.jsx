import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-[#0b3b2e] py-16 text-white">
      <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl">Ready to take control?</h2>
          <p className="mt-2 text-white/80">Start tracking today and grow your money confidence.</p>
        </div>
        <Button className="bg-[#f47d4a] text-white hover:bg-[#e06f3f]" asChild>
          <Link to="/signup">Create free account</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
