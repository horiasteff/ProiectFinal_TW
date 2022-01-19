import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import iconTeam from "../images/icon_team.png";

function TeamRow(props) {
  const navigate = useNavigate();

  const [hidden, setHidden] = useState(true);

  const [utilizatori, setUtilizatori] = useState([]);
  const [echipaId, setEchipaId] = useState("");
  const [echipa, setEchipa] = useState({});
  const [utilizator, setUtilizator] = useState({
    nume: "",
    prenume: "",
    email: "",
    parola: "",
    dataNasteri: "",
    sex: "",
    echipaId: "",
  });

  const loadUtilizatori = async () => {
    const response = await fetch("/utilizatori");
    if (response.status === 200) {
      setUtilizatori(await response.json());
    }
    setEchipaId(props.echipa.id);
  };
  useEffect(() => loadUtilizatori(), []);

  const loadEchipa = async (echipaId) => {
    const response = await fetch(`/echipe/${echipaId}`);
    if (response.status === 200) {
      setEchipa(await response.json());
    }
  };
  useEffect(() => loadEchipa(echipaId), [echipaId]);

  async function iesiDinEchipa() {
    if (
      await document
        .getElementById("dialog")
        .confirmDialog(`Esti sigur ca vrei sa iesi din ${echipa.denumire} ?`)
    ) {
      const utilizator = utilizatori.find((e) => e.id === props.utilizator.id);
      setUtilizator(utilizator);
      utilizator.echipaId = null;

      const response = await fetch(`/utilizatori/${props.utilizator.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utilizator),
      });
      if (response.status === 204) {
        window.location.reload();
      }
    }
  }

  function set(property, value) {
    const record = { ...utilizator };
    record[property] = value;
    setUtilizator(record);
  }

  return (
    <div>
      <div className="name-inline">
        <img src={iconTeam} alt="nu" width="32" height="32" />
        <a href={`/echipe/${props.echipa.id}`} className="row">
          {props.echipa.denumire}{" "}
        </a>
      </div>

      {/* label membru */}
      {props.utilizator.echipaId === props.echipa.id ? (
        <div className="label">[ MP ]</div>
      ) : (
        <div className="label">[ TST ]</div>
      )}

      {/* daca esti MP : iesi/adauga in echipa */}
      {props.utilizator.echipaId === props.echipa.id ? (
        <>
          <div className="div-a">
            <a
              href={`/membri/new?echipaId=${props.echipa.id}`}
              className="a-add"
            >
              &#43; Membru nou
            </a>
          </div>
          <input
            className="btn-pinky"
            type="button"
            value="&#10005;Iesi din echipa"
            onClick={iesiDinEchipa}
          />
        </>
      ) : (
        <div></div>
      )}

      {/* vezi membrii */}
      <input
        className="btn-gray"
        type="button"
        value="Vezi membrii"
        onClick={() => setHidden(!hidden)}
      />

      <ol>
        {hidden ? (
          <div></div>
        ) : (
          utilizatori
            .filter((e) => e.echipaId === props.echipa.id)
            .map((e, index) => (
              <li key={e.id}>
                {e.nume} {e.prenume} [{e.email}]
              </li>
            ))
        )}
      </ol>

      <hr />
      <br />
      <div id="dialog" className="modal-dialog" />
    </div>
  );
}
export default TeamRow;
