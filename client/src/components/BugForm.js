import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import "./confirmDialog";

function BugForm(props) {
  const navigate = useNavigate();

  const { search } = useLocation();
  const queryParameters = new URLSearchParams(search);
  const proiectIdd = queryParameters.get("proiectId");

  const { bugId } = useParams(props);
  const [bug, setBug] = useState({
    subiect: "",
    descriere: "",
    prioritate: "",
    status: "",
    proiectId: proiectIdd,
  });

  const loadBug = async (bugId) => {
    if (bugId !== "new" && bugId) {
      const response = await fetch(`/bugs/${bugId}`);
      if (response.status === 200) {
        setBug(await response.json());
      }
    }
  };
  useEffect(() => loadBug(bugId), [bugId]);

  function set(property, value) {
    const record = { ...bug };
    record[property] = value;
    setBug(record);
  }

  async function saveBug() {
    if (bugId === "new") {
      const response = await fetch("/bugs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bug),
      });
      if (response.status === 201) {
        navigate("/aplicatie");
      }
    } else {
      const response = await fetch(`/bugs/${bugId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bug),
      });
      if (response.status === 204) {
        navigate("/aplicatie");
      }
    }
  }

  async function deleteBug() {
    if (
      bug.id &&
      bug.id !== "new" &&
      (await document
        .getElementById("dialog")
        .confirmDialog("Esti sigur ca vrei sa stergi acest bug?"))
    ) {
      const response = await fetch(`/bugs/${bugId}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        navigate("/");
      }
    }
  }

  return (
    <div>
      <h2>Completeaza datele pentru noul bug al proiectului</h2>
      <div className="form2">
        <div>
          <label>
            Subiect:
            <input
              className="f2"
              value={bug.subiect}
              onChange={(event) => set("subiect", event.target.value)}
            />
          </label>
        </div>

        <div>
          <label id="lb-descriere">Descriere:</label>
          <textarea
            id="descriereB"
            className="f2"
            value={bug.descriere}
            onChange={(event) => set("descriere", event.target.value)}
          >
            {bug.descriere}
          </textarea>
        </div>

        <div>
          <label>
            Prioritate:
            <select
              className="f2"
              onChange={(event) => set("prioritate", event.target.value)}
            >
              <option>-</option>
              <option value="Mica">Mica</option>
              <option value="Medie">Medie</option>
              <option value="Mare">Mare</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Status:
            <select
              className="f2"
              onChange={(event) => set("status", event.target.value)}
            >
              <option>-</option>
              <option value="nerezolvat">nerezolvat</option>
              {bugId !== "new" ? (
                <option value="rezolvat">rezolvat</option>
              ) : (
                <></>
              )}
            </select>
          </label>
        </div>
        <div>
          <label>
            Link Commit rezolvare:
            <input
              id="link"
              className="f2"
              value={bug.linkCommit}
              onChange={(event) => set("linkCommit", event.target.value)}
            />
          </label>
        </div>
      </div>

      <hr />

      <input
        className="btn-green"
        type="button"
        value="Save"
        onClick={saveBug}
      />

      <input
        className="btn-back"
        type="button"
        value="&#x2190; Înapoi"
        onClick={() => navigate(`/aplicatie`)}
      ></input>

      {bugId !== "new" ? (
        <input
          className="btn-pinky"
          type="button"
          value="Delete"
          onClick={deleteBug}
        ></input>
      ) : (
        <div></div>
      )}

      <div id="dialog" className="modal-dialog" />
    </div>
  );
}

export default BugForm;
