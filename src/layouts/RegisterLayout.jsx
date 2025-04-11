import React, { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "../styles/RegisterLayout.css";

const RegisterLayout = ({ children }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "#111" } },
    particles: {
      color: { value: "#fffafa" },
      links: {
        color: "#808b96",
        distance: 100,
        enable: true,
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        outModes: "bounce",
        direction: "none",
        random: true
      },
      number: { 
        value: 270,
        density: { enable: true, area: 1000 }
      },
      opacity: { value: { min: 0.3, max: 0.8 } },
      shape: { type: "circle" },
      size: { 
        value: { min: 1, max: 4 },
        random: true
      }
    },
    detectRetina: true
  }), []);

  return (
    <div className="register-background">
      {init && (
        <Particles
          id="tsparticles-register"
          className="particles-container"
          options={options}
        />
      )}
      <div className="register-content">
        {children}
      </div>
    </div>
  );
};

export default RegisterLayout;
