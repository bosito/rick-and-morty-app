import React, { useState, useEffect } from 'react';
import LoadingComponent from './componets/LoadingComponent.js';
import MenuPrincipal from './views/MenuPrincipal.js';
import SearchBoxContainer from './views/SearchBoxContainer.js';
import './styles/App.css';

export default function App() {
  const [naivigation, setNavigation] = useState("loading");
  
  return (
    <div className="containerPrincipal">
      {
        naivigation === "loading" ? (
          <LoadingComponent setNavigation={setNavigation} />
        ) : naivigation === "menuPrincipal" ? (
          <MenuPrincipal setNavigation={setNavigation} />
        ) : naivigation === "tareaView" ? (
          <SearchBoxContainer setNavigation={setNavigation} />
        ) :  naivigation === "extraView" && (
          <div>

          </div>
        )
      }
    </div>
  );
};