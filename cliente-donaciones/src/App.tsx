import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { data } from './configuration/ppx.data'
import { Link, Route, Switch } from "wouter";
import Inicio from './pages/Inicio'
import MontoTarjeta from './pages/MontoTarjeta'
import { Toaster, } from 'react-hot-toast';
import Donacion from './pages/Donacion'
import Pagado from './pages/Pagado'

const InboxPage = () => {
  return <h1>Inbox</h1>;
};

function App() {
  return (
    <>
    <Toaster position='top-center' />
    <Switch>
      <Route path="/" component={Inicio}>
      </Route>
      <Route path="/inbox" component={InboxPage} />
      <Route path="/tarjeta" component={MontoTarjeta} />
      <Route path="/pagar" component={Donacion} />
      <Route path="/pagado" component={Pagado} />
      <Route path="/users/:name">
        {(params) => <>Hello, {params.name}!</>}
      </Route>

      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
    </>
  )
}

export default App
