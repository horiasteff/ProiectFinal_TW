import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import ProjectRow from "./ProjectRow";
import { useCookies } from "react-cookie";

function TeamForm(props) {
  const [cookies, setCookies] = useCookies("utilizator");
  const id = cookies.id;

  const { echipaId } = useParams(props);
  const [projects, setProjects] = useState([]);

  const [echipa, setEchipa] = useState({
    denumire: "",
  });

  const loadEchipa = async (echipaId) => {
    if (echipaId && echipaId !== "new") {
      const response = await fetch(`/echipe/${echipaId}`);
      if (response.status === 200) {
        setEchipa(await response.json());
      }
    }
  };

  const loadProjects = async () => {
    const response = await fetch("/proiecte");
    if (response.status === 200) {
      setProjects(await response.json());
    }
  };

  useEffect(() => loadEchipa(echipaId), [echipaId]);
  useEffect(() => loadProjects(), []);

  const [utilizator, setUtilizator] = useState({});

  const loadUtilizator = async () => {
    const response = await fetch(`/utilizatori/${id}`);
    if (response.status === 200) {
      setUtilizator(await response.json());
    }
  };
  useEffect(() => loadUtilizator(), []);

  function set(property, value) {
    const record = { ...echipa };
    record[property] = value;
    setEchipa(record);
  }
  const navigate = useNavigate();

  async function makeMP() {
    await fetch(`/utilizatori/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(utilizator),
    });
  }
  async function saveEchipa() {
    if (echipaId === "new") {
      const response = await fetch("/echipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(echipa),
      });

      const location = response.headers.get("Location");
      const idEchipa = location.split("/")[5];

      if (response.status === 201) {
        utilizator["echipaId"] = idEchipa;
        await makeMP();
        navigate("/aplicatie");
      }
    } else {
      const response = await fetch(`/echipe/${echipaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(echipa),
      });
      if (response.status === 204) {
        navigate("/aplicatie");
      }
    }
  }

  async function deleteEchipa() {
    if (
      echipa.id &&
      echipa.id &&
      echipa.id !== "new" &&
      (await document
        .getElementById("dialog")
        .confirmDialog(
          `Esti sigur ca doresti sa stergi echipa ${echipa.denumire} ?`
        ))
    ) {
      const response = await fetch(`/echipe/${echipaId}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        //deleteProiecte()
        navigate("/aplicatie");
      }
    }
  }
  // async function deleteProiect(proiectId) {
  //   const response = await fetch(`/proiecte/${proiectId}`, {
  //     method: 'DELETE',
  //   })
  //   if (response.status === 204) {
  //     console.log('delete' + proiectId)
  //   }
  // }
  // async function deleteProiecte() {
  //   projects
  //     .filter((project) => project.echipaId == echipa.id)
  //     .map((project) => deleteProiect(project.id))
  // }

  function isProjects() {
    const records = projects.filter((project) => project.echipaId == echipaId);
    if (records.length != 0) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      {/* daca apare formul de editare */}
      {utilizator.echipaId == echipaId || echipaId === "new" ? (
        <div>
          <h3>Numele echipei este </h3>
          <input
            id="echipa"
            placeholder="Introduceti numele echipei"
            value={echipa.denumire}
            onChange={(event) => set("denumire", event.target.value)}
          />
          {/* butoane */}
          <input
            className="btn-green"
            type="button"
            value="Save"
            onClick={saveEchipa}
          />

          {/* nu vrem cand e NEW sa poata adauga proiect/sterge echipa */}
          {echipaId === "new" ? (
            <div></div>
          ) : (
            <>
              <input
                className="btn-pinky"
                type="button"
                value="&#10005; Sterge"
                onClick={deleteEchipa}
              />

              <div className="div-a">
                <a
                  href={`/proiecte/new?echipaId=${echipa.id}`}
                  className="a-add"
                >
                  &#43; Proiect Nou
                </a>
              </div>
            </>
          )}
          <hr />
        </div>
      ) : (
        <div className="label2">
          IN ECHIPA <i>[{echipa.denumire}]</i> ESTI DOAR TESTER
        </div>
      )}

      {/* label pentru atunci cand nu avem niciun proiect */}
      {isProjects() ? (
        <h3>Proiectele existente in echipa sunt:</h3>
      ) : (
        <div className="label3">
          Aceasta echipa nu a creat inca nici un proiect
        </div>
      )}

      {projects
        .filter((project) => project.echipaId == echipaId)
        .map((project, index) => (
          <ProjectRow
            key={index}
            proiect={project}
            index={index}
            width={100 / projects.length - 1}
          />
        ))}
      <div>
        <input
          className="btn-back"
          type="button"
          value="&#x2190; Înapoi"
          onClick={() => navigate(`/aplicatie`)}
        ></input>
      </div>
      <div id="dialog" className="modal-dialog" />
    </div>
  );
}

export default TeamForm;
