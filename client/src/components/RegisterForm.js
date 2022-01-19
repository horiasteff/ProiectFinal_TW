import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

function RegisterForm() {
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["utilizator"]);
  const [utilizator, setUtilizator] = useState({
    nume: "",
    prenume: "",
    email: "",
    parola: "",
    dataNasteri: "",
    sex: "",
  });

  const [utilizatori, setUtilizatori] = useState([]);
  const [registerGood, setRegisterGood] = useState(false);

  const getUtilizatori = async () => {
    const response = await fetch("/utilizatori"); //default ruta get
    const data = await response.json();
    setUtilizatori(data);
  };

  useEffect(() => {
    getUtilizatori();
  }, []);

  function validate(property, value) {
    // if ((value != null) & (value.length > 3)) {
    if (property == "email") {
      let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
      if (regex.test(value)) {
        setRegisterGood(true);
        setValidareDiv("");
        set(property, value);
      } else {
        setRegisterGood(false);
        setValidareDiv(`${property.toUpperCase()} nu poate fi ${value}`);
      }
    } else if (property == "sex") {
      if (value != "-") {
        setRegisterGood(true);
        setValidareDiv("");
        set(property, value);
      } else {
        setRegisterGood(false);
        setValidareDiv(`${property.toUpperCase()} nu poate fi ${value}`);
      }
    } else if (
      property == "nume" ||
      property == "prenume" ||
      property == "parola"
    ) {
      if (value != null && value.length > 2) {
        setRegisterGood(true);
        setValidareDiv("");
        set(property, value);
      } else {
        setRegisterGood(false);
        setValidareDiv(`${property.toUpperCase()} nu poate fi ${value}`);
      }
    } else {
      set(property, value);
    }
  }

  function set(property, value) {
    const record = { ...utilizator };
    record[property] = value;
    setUtilizator(record);
  }

  function setValidareDiv(mesaj) {
    document.getElementById("validateR").innerText = mesaj;
  }

  async function saveUtilizator() {
    if (registerGood) {
      const response = await fetch("/utilizatori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(utilizator),
      });

      setCookies("id", utilizator.id, { path: "/" });

      if (response.status === 201) {
        alert("Contul tau a fost inregistrat cu succes!");
      }
    }
  }

  return (
    <div>
      <div className="form">
        <div>
          <label>
            Nume:
            <input
              id="nume"
              type="text"
              require
              placeholder="Introduceti numele"
              onChange={(e) => validate("nume", e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Prenume:
            <input
              id="prenume"
              type="text"
              placeholder="Introduceti prenumele"
              onChange={(e) => validate("prenume", e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Email:
            <input
              id="email"
              type="text"
              placeholder="Introduceti email-ul"
              onChange={(e) => validate("email", e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Parola:
            <input
              id="parola"
              type="password"
              placeholder="Introduceti parola viitoare"
              onChange={(e) => validate("parola", e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>Data nasterii:</label>
          <input
            id="dataNasterii"
            type="date"
            placeholder="Introduceti data nasterii"
            pattern="d{4}-\d{2}-\d{2}"
            onChange={(e) => validate("dataNasteri", e.target.value)}
          />
        </div>

        <div>
          <label>
            Sex:
            <select onChange={(e) => validate("sex", e.target.value)}>
              <option value="-">-</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </label>
        </div>
        <div>
          <input
            id="register"
            type="button"
            value="Inregistrare"
            onClick={saveUtilizator}
          />
        </div>
        <div id="validateR"></div>
      </div>
    </div>
  );
}

export default RegisterForm;
//
