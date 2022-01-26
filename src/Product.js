import React from 'react';
import style from './product.module.css';



const Product = ({usr, cat, prod, callback})=> {
    const getExpirationColor = () => {
        var t = Date.now()
        var tt = Date.parse(prod.expiration)
        var difference= tt-t;
        var days = difference/(1000 * 3600 * 24)
        if(days>3){
            return <span class={style.date}>Date Of Expiration {new Date(prod.expiration).toLocaleDateString()}</span>
        }else{
            return <span class={style.baddate}>Date Of Expiration {new Date(prod.expiration).toLocaleDateString()}</span>
        }
    }
    const incStyle = {
        size : "small",
        fontWeight : 'bold',
      
    };
    const deleteProd = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
            body: JSON.stringify({user:usr, catigory: cat, name:prod.pname})
            
        };

        fetch('http://localhost:8000/users/update', requestOptions);
        callback();
        //window.location.reload();
    }

    return (
        <div key={prod.pname} className={style.inventory}>
            
          
            <li> <span class={style.tag}>{prod.pname}</span> Number: {prod.number}   {getExpirationColor()}</li>
            <button style={incStyle} className="btn btn-danger" onClick={deleteProd} > x </button>

        </div>
    );
}

export default Product;