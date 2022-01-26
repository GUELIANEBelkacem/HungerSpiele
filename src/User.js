import React from 'react';
import style from './user.module.css';
import Product from './Product'

const User = ({key, usr, name, inventory, callback})=> {
    
 
 
   
    return (
        <div key={key} className={style.user}>
            <h1>{name}</h1>
            <ul>
                {inventory.map(inv => <Product usr={usr} cat={name} prod={inv} callback = {callback}/>)}
            </ul>
        </div>
    );
}

export default User;