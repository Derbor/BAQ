import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PpxButton from './components/PpxButton'
import { data } from './configuration/ppx.data'
import { Link, Route, Switch } from "wouter";

const InboxPage = () => {
  return <h1>Inbox</h1>;
};

function App() {
  return (
    <>
    <Switch>
      <Route path="/">
      <h1>Opciones de pago</h1>
        <Link href='/tarjeta'>Tarjeta de credito</Link>
        <br />
        <Link href='/debito'>Debito bancario automatico</Link>
      </Route>
      <Route path="/inbox" component={InboxPage} />
      <Route path="/pagar">
        <PpxButton data={data} />
      </Route>
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
