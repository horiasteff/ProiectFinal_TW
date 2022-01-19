import React from "react";
import IconBug from "../images/icon_bug.png";

function BugRow(props) {
  return (
    <div>
      <div className="name-inline">
        <img src={IconBug} alt="icon bug" width="32" height="32" />

        {props.bug.status == "rezolvat" || props.isTester == 1 ? (
          <a>{props.bug.subiect}</a>
        ) : (
          <a href={`/bugs/${props.bug.id}`} className="row">
            {props.bug.subiect}
          </a>
        )}

        <p>
          <b>Descriere:</b> {props.bug.descriere}
        </p>

        <p>
          <b>Prioritate:</b>
          {props.bug.prioritate}
        </p>

        <p>
          <b>Status:</b>
          {props.bug.status}
        </p>

        <p>
          <b>Link commit rezolvare:</b>
          {props.bug.linkCommit == null ? (
            <span>inca nu s-a rezolvat</span>
          ) : (
            <span>{props.bug.linkCommit}</span>
          )}
        </p>
      </div>
    </div>
  );
}
export default BugRow;
