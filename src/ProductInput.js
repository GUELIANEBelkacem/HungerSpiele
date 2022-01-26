import React,  {useEffect, useState} from 'react';
import style from './user.module.css';

import { DateInput, DatePicker } from '@progress/kendo-react-dateinputs';

const ProductInput = ({callback, userID})  =>{
 
    const [success, setState] = useState(false);
    const [inDate, setInDate] = useState(new Date());
    const [inCat, setInCat] = useState(localStorage.getItem('search'));
    const [inName, setInName] = useState("");
    const [inNum, setInNum] = useState(0);
    
    

    const updateInDate = e => {
        setInDate(e.target.value)
    }
    const updateInCat = e => {
        setInCat(e.target.value)
    }
    const updateInName = e => {
        setInName(e.target.value)
    }
    const updateInNum = e => {
        setInNum(parseInt(e.target.value))
    }
    const refreshPage = ()=>{
        window.location.reload();
     }
    const handleSubmit = (e) => {
        e.preventDefault();
        setState(true);
        setTimeout(() => {setState(false); }, 3000);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
            body: JSON.stringify({user:userID, catigory: inCat, name:inName, number:inNum, date:inDate })
            
        };

        fetch('http://localhost:8000/users/submit', requestOptions)
        /*
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

        })
        .catch(error => {
            
            console.error('There was an error!', error);
        });
        */
        //window.location.reload();
        callback();

    }
    const today = new Date();
    return(
        

        
          <div >
            <div >
              <div >
                <div >
                  <form  onSubmit={handleSubmit}>
                    <fieldset className={style.form}>
                      <legend>Enter Your Product:</legend>
                      <label className="k-form-field">
                      <span>Category
                      <input className={style.input} type="text" value={inCat} onChange={updateInCat}></input>
                      </span>
                      <br/>
                      <span>Product name
                      <input className={style.input} type="text" value={inName} onChange={updateInName}></input>
                      </span>
                      <br/>
                      <span>Number of Products
                      <input className={style.input} type="text" value={inNum} onChange={updateInNum}></input>
                      </span>
                      <br/>
                      <span> Date of Expiration 
                        <DatePicker
                          format={"dd-MMM-yyyy"}
                          width="100%"
                          name="expiration"
                          required={true}
                          min={today}
                          value={inDate}
                          onChange = {updateInDate}
                          
                                        />
                    </span>
                    <br/>
                    <button className="search-button" type="submit">Add Product</button>
                      </label>
                    </fieldset>
                    
                  </form>
                </div>
              </div>
            </div>
            {success && (
            <div
              className="alert alert-success"
              style={{ position: 'absolute' }}
                    >
              Product submitted!
            </div>)}
          </div>
        );
    

    
}

export default ProductInput;