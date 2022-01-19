import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

function MPForm() {
  const navigate = useNavigate();

  const { search } = useLocation();
  const queryParameters = new URLSearchParams(search);
  const echipaIdw = queryParameters.get("echipaId");

  const [utilizator, setUtilizator] = useState({
    nume: "",
    prenume: "",
    email: "",
    parola: "",
    dataNasteri: "",
    sex: "",
    echipaId: echipaIdw,
  });

  const [utilizatori, setUtilizatori] = useState([]);
  const [echipa, setEchipa] = useState({});
  const [ID, setID] = useState(0);

  async function loadUtilizator(ID) {
    if (ID != 0) {
      const response = await fetch(`/utilizatori/${ID}`);
      if (response.status === 200) {
        setUtilizator(await response.json());
      }
    }
  }
  useEffect(() => loadUtilizator(ID), [ID]);

  async function loadEchipa(echipaId_) {
    if (echipaId_) {
      const response = await fetch(`/echipe/${echipaId_}`);
      if (response.status === 200) {
        setEchipa(await response.json());
      }
    }
  }
  useEffect(() => loadEchipa(echipaIdw), [echipaIdw]);

  const loadUtilizatori = async () => {
    const response = await fetch("/utilizatori");
    if (response.status === 200) {
      setUtilizatori(await response.json());
    }
  };
  useEffect(() => loadUtilizatori(), []);

  async function addMembru() {
    set("echipaId", echipaIdw);

    const response = await fetch(`/utilizatori/${ID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(utilizator),
    });
    if (response.status === 204) {
      navigate("/aplicatie");
    }
  }

  function set(property, value) {
    const record = utilizator;
    record[property] = value;
    setUtilizator(record);
  }

  return (
    <div>
      <div>
        <h3>
          Alege unul dintre utilizatori din baza de date pentru a fi membru in
          echipa <b>[{echipa.denumire}]</b>
        </h3>

        <select
          className="combobox-membru"
          value={ID}
          onChange={(event) => setID(event.target.value)}
        >
          <option>-</option>
          {utilizatori
            .filter((e) => e.echipaId == null)
            .map((e, index) => (
              <option key={index} value={e.id}>
                {e.nume} {e.prenume} [{e.email}]
              </option>
            ))}
        </select>
      </div>
      <input
        className="btn-back"
        type="button"
        value="&#x2190; Înapoi"
        onClick={() => navigate(`/aplicatie`)}
      />
      <input
        className="btn-green"
        type="button"
        value="Save"
        onClick={addMembru}
      />
    </div>
  );
}

export default MPForm;
