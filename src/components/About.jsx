import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

const About = () => {
  const one = (
    <p>
      I am <b>Prajal Gautam</b>, a software developer focused on MERN stack and
      Business Intelligence. I enjoy building practical applications and
      learning by shipping real projects.
    </p>
  );
  const two = (
    <p>
      I study at <b>NCIT College</b> under <b>Pokhara University</b> and I am
      currently in <b>5th semester</b>.
    </p>
  );

  const techStack = [
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
    "JavaScript ES6+",
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header ">
          <span className="section-title">/ about me</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            {one}
            {"Here are some technologies I have been working with:"}
            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <li>{techItem}</li>
                </FadeInSection>
              ))}
            </ul>
            {two}
          </div>
          <div className="about-image">
            <img alt="Prajal Gautam" src={"/profile.png"} />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
