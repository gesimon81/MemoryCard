import { useState, useEffect } from "react";

export function Card({ value, isHidden, onCardClick, isDone }) {
  return (
    <button className="square" onClick={onCardClick} style={{ padding: 15 }}>
      {isHidden && !isDone ? "" : value}
    </button>
  );
}

export default function Board({ size }) {
  //Version 4 cartes sans shuffle, pour tester
  /*const [cards, setCards] = useState([
    { id: 0, value: "", isDone: false, isHidden: true },
    { id: 1, value: "", isDone: false, isHidden: true }
    { id: 2, value: "", isDone: false, isHidden: true },
    { id: 3, value: "", isDone: false, isHidden: true }
  ]);
  const cardsValuesStart = ["1", "1", "2", "2"];*/

  //State des cartes et des paires
  const [cards, setCards] = useState(() => {
    // take 16 letters
    //const values = "ABCDEFGHIJKLMNOP".split("");
    const values = generateArray(size);
    const allCards = values.concat(values).map((value, index) => ({
      id: index,
      value,
      isHidden: true
    }));
    return shuffle(allCards);
  });

  //State pour gérer les tours
  const [nbTries, setNbTries] = useState(0);

  function handleClick(cardIndex) {
    const currentCard = cards.filter((card) => card.id === cardIndex)[0];

    console.log("handleClick() currentCard", currentCard);

    //Ne pas changer le rendu si click sur une carte déjà révélée ou déjà validée
    if (currentCard.isDone || !currentCard.isHidden) {
      return;
    }

    // Si 2 cartes déjà visibles, ne pas faire de modifications du state
    if (cards.filter((card) => !card.isHidden && !card.isDone).length >= 2) {
      return;
    }

    //Sinon, afficher la valeur de la carte et si 2 cartes, tester la paire
    console.log("tests ok");

    let newCards = [...cards];

    //Changer la valeur des cartes pour prendre en compte la nouvelle carte affichée
    newCards = newCards.map((card) => {
      if (card.id === cardIndex) {
        if (card.isHidden) {
          return {
            ...card,
            //value: cardsValuesStart[cardIndex],
            isHidden: false
          };
        } else {
          return {
            ...card,
            //value: "",
            isHidden: true
          };
        }
      } else {
        return card;
      }
    });
    console.log("debug", newCards);

    //Si 1 carte affichée = ne rien faire; Si 2 cartes = tester si une paire est présente
    const cardsReavealed = newCards.filter(
      (card) => !card.isHidden && !card.isDone
    );

    if (cardsReavealed.length === 2) {
      console.log("2 cartes affichées");
      //Comparer les valeurs des deux cartes pour vérifier si une paire est présente
      if (cardsReavealed[0].value === cardsReavealed[1].value) {
        console.log("paire !");
        newCards = newCards.map((card) => {
          if (
            card.id === cardsReavealed[0].id ||
            card.id === cardsReavealed[1].id
          ) {
            return {
              ...card,
              value: "✓",
              isDone: true
            };
          } else {
            return {
              ...card
            };
          }
        });

        setCards(newCards);
      } else {
        //Pas de paire, donc on cache les cartes
        //Affichage du rendu avec les valeurs révélées, pour que le joueur puisse mémoriser
        setCards(newCards);

        //Affichage du rendu sans les valeurs
        newCards = newCards.map((card) => {
          if (
            card.id === cardsReavealed[0].id ||
            card.id === cardsReavealed[1].id
          ) {
            return {
              ...card,
              //value: "",
              isHidden: true
            };
          } else {
            return {
              ...card
            };
          }
        });

        setTimeout(() => {
          setCards(newCards);
        }, 1000);
      }

      setNbTries((nbTries) => nbTries + 1);
    } else {
      //1 seule carte affichée
      console.log("1 carte affichée");
      setCards(newCards);
    }
  }

  //Vérifier si la partie est terminée
  useEffect(() => {
    if (cards.filter((card) => !card.isDone).length === 0) {
      setTimeout(() => {
        alert(
          "Félicitations. Toutes les paires ont été trouvées. \nNombre d'essais nécessaires : " +
            nbTries
        );
      }, 200);
    }
  }, [cards, nbTries]);

  return (
    <>
      <div className="board">
        {cards.map((card) => (
          <Card
            key={card.id}
            value={card.value}
            isHidden={card.isHidden}
            isDone={card.isDone}
            onCardClick={() => handleClick(card.id)}
          />
        ))}
      </div>

      <br />
      <br />

      <div>Nombre d'essais : {nbTries}</div>
    </>
  );
}

function shuffle(array) {
  const newArray = [...array];
  for (let i = 0; i < newArray.length; i++) {
    const randomIndex = Math.floor(Math.random() * newArray.length);
    const temp = newArray[i];
    newArray[i] = newArray[randomIndex];
    newArray[randomIndex] = temp;
  }
  return newArray;
}

function generateArray(size) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(i);
  }
  return array;
}
