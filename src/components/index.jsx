import React, { useState } from "react";
import Header from "../components/Header";
import StarsBackground from "../components/StarsBackground";
import "../styles/Home.css"; // Si renombraras a index.css, cámbialo aquí

const Index = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("contactData", JSON.stringify(contact));
    alert("Mensaje enviado. Gracias por contactarnos.");
    setContact({ name: "", email: "", message: "" });
  };

  return (
    <div className="home-layout-wrapper">
      <StarsBackground />
      <Header />
      <main className="home-main-content">
        <div id="home" className="hero-section">
          <h1 className="main-title">
            <span className="outline-part">Ware</span>
            <span className="fill-part">Solucions</span>
          </h1>
          <p className="slogan">Tecnología contra el fuego</p>
        </div>

        {/* Contenido publicitario */}
        <div className="features-grid">
          <div className="feature-card">
            <h2 className="feature-title">Detección Inteligente</h2>
            <p className="feature-text">
              Sistema de alerta temprana que identifica riesgos
              de incendio antes de que ocurran
            </p>
          </div>
          <div className="feature-card">
            <h2 className="feature-title">Tecnología 360°</h2>
            <p className="feature-text">
              Sensores térmicos y de humo con cobertura completa y análisis en
              tiempo real
            </p>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="cta-section">
          <h2 className="cta-title">¿Listo para una protección real?</h2>
          <div className="cta-buttons">
            <button className="cta-button demo">Agendar demostración</button>
            <button className="cta-button contact">Contacto inmediato</button>
          </div>
        </div>

        <section id="about" className="about-section">
          <h2 className="section-title">Quiénes Somos</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                WareSolucions es una empresa innovadora dedicada al desarrollo
                de detectores de incendios. Nuestro proyecto insignia utiliza
                tecnología avanzada para monitorear y detectar riesgos en
                tiempo real, protegiendo hogares y empresas con soluciones
                inteligentes.
              </p>
            </div>
            <div className="about-image">
              <img
                src="/src/assets/images/imgen1-removebg-preview.png"
                alt="Quiénes Somos"
              />
            </div>
          </div>
        </section>

        <section id="services" className="services-section">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="services-grid">
            <div className="service-card">
              <img
                src="/src/assets/images/imagen2-removebg-preview.png"
                alt="Detección Avanzada"
              />
              <h3 className="service-title">Detección Avanzada</h3>
              <p className="service-text">
                Monitoreamos áreas críticas con sensores inteligentes que
                detectan incendios en tiempo real.
              </p>
            </div>
            <div className="service-card">
              <img
                src="/src/assets/images/imagen3-removebg-preview.png"
                alt="Mantenimiento Preventivo"
              />
              <h3 className="service-title">Mantenimiento Preventivo</h3>
              <p className="service-text">
                Ofrecemos mantenimiento regular para asegurar el óptimo
                funcionamiento de nuestros sistemas.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <h2 className="section-title">Contáctanos</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={contact.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Tu correo electrónico"
              value={contact.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Tu mensaje"
              value={contact.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="cta-button contact">
              Enviar Mensaje
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} WareSolucions. Todos los derechos
          reservados. Innovando en detección de incendios.
        </p>
      </footer>
    </div>
  );
};

export default Index;
