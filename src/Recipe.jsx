import React from 'react';
import style from './recipe.module.css';

const Recipe = ({rlink, title, image, price, ingredients})=> {
    return (
        <div key={title} className={style.recipe}>
            <h1 ><a href={rlink} className={style.title} target="_blank">{title}</a></h1>
            <h4 className={style.price}>{price} €</h4>
            <ol>
                {ingredients.map(ingr => <li>{ingr.original}</li>)}
            </ol>
            <a href={rlink} target="_blank">
            <img src={image} alt={title} className={style.image}></img>
            </a>

        </div>
    );
}

export default Recipe;