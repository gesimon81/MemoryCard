import Board from "./Cards";
import React, { useState } from "react";

export default function Game() {
  const [inputNbPaires, setInputNbPaires] = useState(8); // Ajout d'un état pour contrôler l'affichage du composant Board
  const [boardKey, setBoardKey] = useState(0); // Utilisez une clé pour forcer la recréation du composant Board

  const handleNbPairesClick = () => {
    console.log("nouvelle partie taille", inputNbPaires);
    setBoardKey(boardKey + 1); // Incrémente la clé pour recréer le composant Board
  };

  return (
    <>
      <div>
        <label htmlFor="nbPaires"> Nombre de paires: </label>
        <input
          type="text"
          id="nbPaires"
          name="nbPaires"
          value={inputNbPaires}
          onChange={(e) => setInputNbPaires(e.target.value)}
        />

        <button onClick={handleNbPairesClick}>Nouvelle partie</button>
        <br />
        <br />
      </div>
      <Board key={boardKey} size={inputNbPaires} />
      {/* Utilisez la clé pour recréer le composant Board */}
    </>
  );
}
