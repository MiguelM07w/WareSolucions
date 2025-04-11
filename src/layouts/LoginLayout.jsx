import React, { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "../styles/LoginLayout.css";

const LoginLayout = ({ children }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "#111" } },
    particles: {
      color: { value: ["#fffafa"] },
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
        value: 250,
        density: { enable: true, area: 800 }
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
    <div className="login-background">
      {init && (
        <Particles
          id="tsparticles-login"
          className="particles-container"
          options={options}
        />
      )}
      <div className="login-wrapper">
        {children} {/* Aquí se renderiza el Login */}
      </div>
      {/* Imagen en la parte superior derecha */}
      <img src="./src/assets/images/new-ware.png" className="login-logo" alt="Logo" />
    </div>
  );
};

export default LoginLayout;