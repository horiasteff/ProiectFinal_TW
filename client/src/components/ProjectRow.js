import React from 'react'
import IconProject from '../images/icon_project.png'

function ProjectRow(props) {
  return (
    <div>
      <div className="name-inline">
        <img src={IconProject} alt="icon project" width="32" height="32" />
        <a href={`/proiecte/${props.proiect.id}`} className="row">
          {props.proiect.denumire}
        </a>
        <p>[{props.proiect.descriere}]</p>
      </div>
    </div>
  )
}
export default ProjectRow
