import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";

const projects = {
  "My Projects": {
    desc: "Coming soon. I am currently building new projects and will publish them here soon.",
    techStack: "MERN Stack, BI",
    link: "https://github.com/prajalgautam",
    open: "https://www.instagram.com/prajalgtm/",
  },
};

const Projects = () => {
  return (
    <div id="projects">
      <div className="section-header ">
        <span className="section-title">/ projects</span>
        <a
          href="https://github.com/prajalgautam"
          className="explore-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all projects
        </a>
      </div>
      <div className="project-container">
        <ul className="projects-grid">
          {Object.keys(projects).map((key, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
              <li className="projects-card">
                <div className="card-header">
                  <div className="folder-icon">
                    <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                  </div>
                  <ExternalLinks
                    githubLink={projects[key]["link"]}
                    openLink={projects[key]["open"]}
                  />
                </div>

                <div className="card-title">{key}</div>
                <div className="card-desc">{projects[key]["desc"]}</div>
                <div className="card-tech">{projects[key]["techStack"]}</div>
              </li>
            </FadeInSection>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
