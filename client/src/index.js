import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './index.css'
import Start from './components/Start'
import Application from './components/Application'
import ProjectForm from './components/ProjectForm'
import TeamForm from './components/TeamForm'
import BugForm from './components/BugForm'
import MPForm from './components/MPForm'
import reportWebVitals from './reportWebVitals'
import { CookiesProvider } from 'react-cookie'

ReactDOM.render(
  <CookiesProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/aplicatie" element={<Application />} />
        <Route path="/echipe/:echipaId" element={<TeamForm />} />
        <Route path="/proiecte/:proiectId" element={<ProjectForm />} />
        <Route path="/bugs/:bugId" element={<BugForm />} />
        <Route path="/membri/:membri" element={<MPForm />} />
      </Routes>
    </Router>
  </CookiesProvider>,
  document.getElementById('root'),
)

reportWebVitals()
