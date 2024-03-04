import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Profile/user-profile"
import UserProfileAdd from "../pages/Profile/user-profile-add"
import ProfileExpAdd from "../pages/Profile/user-profile-experimento-add"

// Experimento
import ExperimentoAdd from "../pages/Experimento/AddExperimento"
import ExperimentoAddConfirm from "../pages/Experimento/AddExperimentoConf"
import ExperimentoAddAll from "../pages/Experimento/ExperimentoAdd"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
// Componentes
import Componentes from "../pages/Componentes/index"
import ComponentesAdd from "../pages/AddComponentes/index"
import Editar from "../pages/AddComponentes/editar"
import Solicitar from "../pages/AddComponentes/solicitar"
import SolicitarAddConfirm from "../pages/AddComponentes/SolicitarAddConfirm"
//tipoComponente
import TipoComponenteBuscar from "../pages/TipoComponentes/Buscar"
import TipoComponenteAdicionar from "../pages/TipoComponentes/Adicionar"
//disciplinas
import AddDisciplina from "pages/AddDisciplina/index"
import AddDisciplina2 from "pages/AddDisciplina/add"
import Usuarios from "pages/Usuarios/index"
// incluir disciplina
import IncluirDisciplina from "pages/IncluirDisciplina/IncluirDisciplina"
// not found 
import NotFound from "pages/NotFound/pages-404"

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard/> },

  //Componentes
  { path: "/componentes/buscar", component: <Componentes/> },
  { path: "/componentes/adicionar", component: <Editar/> },
  { path: "/componentes/adicionar2/:componenteId", component: <ComponentesAdd/> },
  { path: "/componentes/solicitar", component: <Solicitar/> },
  { path: "/solicitarAddConf", component: <SolicitarAddConfirm /> },
  //TipoComponentes
  { path: "/tipocomponente/buscar", component: <TipoComponenteBuscar/> },
  { path: "/tipocomponente/adicionar/:tipoComponenteId", component: <TipoComponenteAdicionar/> },
  //disciplinas
  { path: "/disciplinas/adicionar", component: <AddDisciplina/> },
  { path: "/disciplinas/adicionar2", component: <AddDisciplina2/> },
  // incluirDisciplina
  {path: "/disciplinas/incluir", component: <IncluirDisciplina/>},
  // experimento
  { path: "/experimentoadd/:experimentoId", component: <ExperimentoAdd /> },
  { path: "/experimentoaddConf/:experimentoId", component: <ExperimentoAddConfirm /> },
  { path: "/experimentoaddaddall/", component: <ExperimentoAddAll /> },
  //usuarios
  { path: "/usuarios/adicionar", component: <Usuarios/> },

  // //profile
  { path: "/profile", component: <UserProfile/> },
  { path: "/profile/mydisciplina", component: <UserProfileAdd /> },
  { path: "/profile/experimentoadd/:disciplinaId", component: <ProfileExpAdd /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
   {
    path: "/",
    exact: true,
    component: < Navigate to="/componentes/buscar" />,
  },
    // "not found" route
    {
      path: "*", // or "/"
      component: <NotFound />,
    },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login-safe", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes }

