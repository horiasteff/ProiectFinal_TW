import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import BugRow from "./BugRow";
import { useCookies } from "react-cookie";

function ProjectForm(props) {
  const [cookies, setCookies] = useCookies("utilizator");
  const utilizatorId = cookies.id;
  const [utilizator, setUtilizator] = useState([]);

  const { search } = useLocation();
  const queryParameters = new URLSearchParams(search);
  const echipaId = queryParameters.get("echipaId");

  const navigate = useNavigate();
  const { proiectId } = useParams(props);
  const [proiect, setProiect] = useState({
    denumire: "",
    descriere: "",
    url: "",
    echipaId: echipaId,
  });
  const [bugs, setBugs] = useState([]);
  const [utilizatori, setUtilizatori] = useState([]);

  const loadUtilizator = async (utilizatorId) => {
    if (utilizatorId) {
      const response = await fetch(`/utilizatori/${utilizatorId}`);
      if (response.status === 200) {
        setUtilizator(await response.json());
      }
    }
  };
  useEffect(() => loadUtilizator(utilizatorId), [utilizatorId]);

  const loadProiect = async (proiectId) => {
    if (proiectId && proiectId !== "new") {
      const responseHead = await fetch(`/proiecte/${proiectId}`, {
        method: "HEAD",
      });
      if (responseHead.status === 204) {
        const response = await fetch(`/proiecte/${proiectId}`);
        if (response.status === 200) {
          setProiect(await response.json());
        }
      } else {
        navigate("/aplicatie");
      }
    }
  };
  useEffect(() => loadProiect(proiectId), [proiectId]);

  const loadBugs = async () => {
    const response = await fetch("/bugs");

    if (response.status === 200) {
      setBugs(await response.json());
    }
  };

  useEffect(() => loadBugs(), []);

  const loadUtilizatori = async () => {
    const response = await fetch("/utilizatori");

    if (response.status === 200) {
      setUtilizatori(await response.json());
    }
  };

  useEffect(() => loadUtilizatori(), []);

  function set(property, value) {
    const record = { ...proiect };
    record[property] = value;
    setProiect(record);
  }

  async function saveProiect() {
    if (proiectId === "new") {
      const response = await fetch("/proiecte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proiect),
      });
      if (response.status === 201) {
        navigate(`/echipe/${proiect.echipaId}`);
      }
    } else {
      const response = await fetch(`/proiecte/${proiectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proiect),
      });
      if (response.status === 204) {
        navigate(`/echipe/${proiect.echipaId}`);
      }
    }
  }

  async function deleteProject() {
    if (
      proiect.id &&
      proiect.id !== "new" &&
      (await document
        .getElementById("dialog")
        .confirmDialog(
          `Esti sigur ca vrei sa stergi proiectul ${proiect.denumire} ? `
        ))
    ) {
      const response = await fetch(`/proiecte/${proiect.id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        window.location.reload();
      }
    }
  }

  function isBugs() {
    const records = bugs.filter((bug) => bug.proiectId == proiectId);
    if (records.length != 0) {
      return true;
    } else {
      return false;
    }
  }

  function isTester() {
    if (utilizator.echipaId === proiect.echipaId) {
      return 0;
    } else {
      return 1;
    }
  }

  return (
    <div>
      {/* doar daca esti mp poti adauga un proiect */}
      {utilizator.echipaId == proiect.echipaId ? (
        <div className="form2">
          <div>
            <label>
              Denumire:
              <input
                id="denumireP"
                value={proiect.denumire}
                onChange={(event) => set("denumire", event.target.value)}
              />
            </label>
          </div>
          <div>
            <label id="lb-descriere">Descriere:</label>
            <textarea
              value={proiect.descriere}
              id="descriereP"
              onChange={(event) => set("descriere", event.target.value)}
            >
              {proiect.descriere}
            </textarea>
          </div>
          <div>
            <label>
              URL:
              <input
                id="urlP"
                value={proiect.url}
                onChange={(event) => set("url", event.target.value)}
              />
            </label>
          </div>
          <input
            className="btn-green"
            type="button"
            value="Salveaza"
            onClick={saveProiect}
          />
          <input
            className="btn-pinky"
            type="button"
            value="&#10005; Sterge"
            onClick={deleteProject}
          />

          <hr />
        </div>
      ) : (
        <div></div>
      )}

      {/* label pentru atunci cand nu avem niciun proiect */}
      {isBugs() ? (
        <h3>Bug-urile existente in proiect sunt:</h3>
      ) : (
        <div className="label3">Aceast proiect nu are niciun bug</div>
      )}

      {bugs
        .filter((bug) => bug.proiectId == proiectId)
        .map((bug, index) => (
          <BugRow
            key={index}
            bug={bug}
            isTester={isTester()}
            index={index}
            width={100 / bugs.length - 1}
          />
        ))}

      {
        <div>
          <input
            className="btn-back"
            type="button"
            value="&#x2190; Înapoi"
            onClick={() => navigate(`/echipe/${proiect.echipaId}`)}
          />

          {utilizator.echipaId === proiect.echipaId && proiect.id !== "new" ? (
            <div></div>
          ) : (
            <div className="div-a">
              <a href={`/bugs/new?proiectId=${proiect.id}`} className="a-add">
                &#43; Bug nou
              </a>
            </div>
          )}
        </div>
      }
      <div id="dialog" className="modal-dialog" />
    </div>
  );
}

export default ProjectForm;
