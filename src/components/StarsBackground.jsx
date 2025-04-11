import React, { useEffect, useMemo, useState } from "react";
import { Particles, initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadFirePreset } from "@tsparticles/preset-fire"; // Importamos el preset

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadFirePreset(engine); // Cargamos el preset de fuego
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    preset: "fire", // Usamos el preset
    background: {
      color: "#111",
      opacity: 0
    },
    particles: {
      color: {
        value: ["#ff4400", "#ff9933", "#ffdd00"] // Personalización adicional
      },
      move: {
        speed: 1.8 // Ajuste de velocidad
      },
      number: {
        value: 150 // Más partículas
      }
    },
    emitters: {
      size: {
        width: 150, // Fuente de fuego más ancha
        height: 15
      }
    }
  }), []);

  return init ? (
    <Particles
      id="tsparticles"
      className="particles-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none" // Permite interactuar con elementos debajo
      }}
      options={options}
    />
  ) : null;
};

export default ParticlesBackground;