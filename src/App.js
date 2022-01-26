import './App.css';
import React, {useEffect, useState} from 'react';
import Recipe from './Recipe'

// use effect let's you listen to a change in something then preform an action as soon as that something changes

const App = () => {
  const foodAPIID = "63375e2d";
  const foodAPIKey = "d7b17ea9adff0780ccbbadb45b52403d";



  const [recipes, setRecipes] = useState([]);
  const [tempSearch, setTempSearch] = useState("");
  const [search, setSearch] = useState("banana");

  

  useEffect(()=>{
    searchRecette();
  }
  ,[search]
  );

  const searchRecette = async () => {
    //const response = await fetch(`https://api.edamam.com/search?q=${search}&app_id=${foodAPIID}&app_key=${foodAPIKey}`);
    const cleanSearch = search.replace(/\s/g, '+')
    const response = await fetch(`http://localhost:8000/recipes/search/${cleanSearch}`);
    const data = await response.json();
    console.log(data)
    setRecipes(data.results);
  }

  const updateTempSearch = e=>{
    setTempSearch(e.target.value);
  }
  const updateSearch = e=>{
    e.preventDefault();
    setSearch(tempSearch);
    setTempSearch("");
  }
  return (
    <div className="App">
      <form onSubmit={updateSearch} className="search-form">
        <input className="search-bar" type="text" value={tempSearch} onChange={updateTempSearch}></input>
        <button className="search-button" type="submit">search</button>
      </form>
      <div className="recipes">
        {recipes.map(recipe => (<Recipe key={recipe.title} rlink={recipe.spoonacularSourceUrl} title ={recipe.title} image={recipe.image} price={parseFloat(recipe.priceeuro).toFixed(0)} ingredients={recipe.extendedIngredients} />))}
      </div>
      <div className="bar">
        <h4>made by <a href="mailto:mohamed.gueliane@gmail.com" rel="external">B&J</a> </h4>
      </div>
    </div>
    
  );
}

export default App;
