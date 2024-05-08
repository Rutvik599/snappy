import React from "react";
import "../style/teamsnappy.css";
import { Linkedin} from "lucide-react";
import deva from '../Products-Images/deva.jpeg';
import devm from '../Products-Images/devm.jpeg';
import rutvik from '../Products-Images/rutvikimage.jpeg';
import margen from '../Products-Images/margenimage.jpeg';

export default function Teamsnappy() {
  return (
    <div className="mainTeam">
      <div className="rutvik" id="team">
        <img src={rutvik} alt="" className="images"/>
        <h1 className="name">Rutvik V. Patel</h1>
        <br />
        <h1 className="role">Role - FrontEnd Developer </h1>
        <span className="divider"></span>
        <a
          href="https://www.linkedin.com/in/rutvikpatel599/"
          className="linkedin"
        >
          <Linkedin
            size={20}
            style={{ marginRight: "5px", color: "GrayText" }}
          />
          Linkedin
        </a>
      </div>
      <div className="margen" id="team">
      <img src={margen} alt="" className="images"/>
        <h1 className="name">Margen V. Patel</h1>
        <br />
        <h1 className="role">Role - UI/UX Designer + PPT work</h1>
        <span className="divider"></span>
        <a
          href="https://www.linkedin.com/in/patel-margen-3b34ab272/"
          className="linkedin"
        >
          <Linkedin
            size={20}
            style={{ marginRight: "5px", color: "GrayText" }}
          />
          Linkedin
        </a>
      </div>
      <div className="dev" id="team">
        <img src={deva} alt=""  className="images"/>
        <h1 className="name">Dev A. Patel</h1>
        <br />
        <h1 className="role">Role - Backend Developer + Documentation</h1>
        <span className="divider"></span>
        <a
          href="https://www.linkedin.com/in/dev-patel-909969229"
          className="linkedin"
        >
          <Linkedin
            size={20}
            style={{ marginRight: "5px", color: "GrayText" }}
          />
          Linkedin
        </a>
      </div>
      <div className="devm" id="team">
      <img src={devm} alt="" className="images"/>
        <h1 className="name">Dev M. Patel</h1>
        <br />
        <h1 className="role">Role - Backend Developer + Documentation</h1>
        <span className="divider"></span>
        <a
          href="https://www.linkedin.com/in/dev-patel-14a4bb300/"
          className="linkedin"
        >
          <Linkedin
            size={20}
            style={{ marginRight: "5px", color: "GrayText" }}
          />
          Linkedin
        </a>
      </div>
    </div>
  );
}
