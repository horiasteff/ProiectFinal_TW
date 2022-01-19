import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import TeamRow from "./TeamRow";
import { useCookies } from "react-cookie";

function Application(props) {
  const navigate = useNavigate();

  const [cookies, setCookies] = useCookies("utilizator");
  const id = cookies.id;

  const [echipe, setEchipe] = useState([]);
  const [utilizator, setUtilizator] = useState({});

  const loadEchipe = async () => {
    const responseEchipe = await fetch("/echipe");
    if (responseEchipe.status === 200) {
      setEchipe(await responseEchipe.json());
    }
  };
  useEffect(() => loadEchipe(), []);

  const loadUtilizator = async () => {
    const response = await fetch(`/utilizatori/${id}`);
    if (response.status === 200) {
      setUtilizator(await response.json());
    }
  };
  useEffect(() => loadUtilizator(), []);

  return (
    <div>
      <h1>
        Bine ai venit in aplicatie,
        <b>
          {utilizator.nume} {utilizator.prenume}
        </b>
        !
      </h1>

      <div className="descriere">
        ECHIPE DEJA FORMATE:
        <a href={`/echipe/new`} className="add">
          &#43; Echipa noua
        </a>
      </div>
      {echipe.map((echipa, index) => (
        <TeamRow
          key={index}
          echipa={echipa}
          utilizator={utilizator}
          index={index}
          width={100 / echipe.length - 1}
        />
      ))}

      <input
        className="btn-back"
        type="button"
        value="&#x2190; Înapoi"
        onClick={() => navigate(`/`)}
      />
    </div>
  );
}

export default Application;
