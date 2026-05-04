import React from "react";
import "../styles/Intro.css";
import { TypeAnimation } from "react-type-animation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";

const Intro = () => {
  return (
    <div id="intro">
      <div className="intro-simulation">
        <AsciiPortrait />
      </div>
      <div className="intro-block">
        <div className="intro-title">
          {"hi, "}
          <span className="intro-name">
            <TypeAnimation
              sequence={["prajal"]}
              wrapper="span"
              cursor={false}
              repeat={0}
            />
          </span>
          {" here."}
          <span className="intro-cursor">|</span>
        </div>
        <FadeInSection>
          <div className="intro-desc">
            MERN stack and BI enthusiast building practical web products. I am
            currently in 5th semester at NCIT College (Pokhara University) and
            focused on shipping clean, useful software projects.
          </div>
          <div className="intro-actions">
            <a href="https://github.com/prajalgautam" className="intro-contact" target="_blank" rel="noopener noreferrer">
              <EmailRoundedIcon />
              {" Connect"}
            </a>
            <a href="/assets/resume/Prajal-Gautam-Resume.pdf" className="intro-resume" target="_blank" rel="noopener noreferrer" download>
              {"Resume"}
            </a>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
