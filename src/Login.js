import React, {useEffect, useState} from 'react';
import User from './User'
import ProductInput from './ProductInput'
import style from './user.module.css';
import logimg from './images/login.png'

const Login = () =>{
    const [users, setUsers] = useState([]);
    const [tempSearch, setTempSearch] = useState("");
    const [search, setSearch] = useState("");
    const [add, setAdd] = useState(false);

    const [userTemp, setUserTemp] = useState("");
    const [passwordTemp, setPasswordTemp] = useState("");
    const [userNameV, setUserNameV] = useState("");
    const [passwordV, setPasswordV] = useState("");

    const [logedIn, setLogedIn] = useState(false);
    const [firstTime, setFirstTime] = useState(false);
    const [wp, setWp] = useState(false);

    

    const [callBack, setCallBack] = useState(false);

    useEffect(()=>{searchUser();},[search, callBack]);
    useEffect(()=>{searchID();},[userNameV]);

    const callBackFunc = () => {
      setCallBack(!callBack);
    }
    const updateTempSearch = e=>{
        setTempSearch(e.target.value);
    }

    const updateSearch = e=>{
        e.preventDefault();
        setSearch(tempSearch);
        setTempSearch("");
    }
   
   const updateUser = e=>{
      e.preventDefault();
      setPasswordV(passwordTemp);
      setPasswordTemp("");
      setUserNameV(userTemp.replace(/\s/g, ''));
      setUserTemp("");
    }

    const updateUserTemp = e=>{
      
      setUserTemp(e.target.value);
    
    }
    const updatePasswordTemp = e=>{
      
      setPasswordTemp(e.target.value);
  }
    const worngPassword = () => {
      if(wp){
      return <div class="alert alert-warning">
      <strong>Wrong Password!</strong> please try again
    </div>
      }
   }

   const firstTimeMessage = () => {
    if(firstTime){
    return <div class="alert alert-warning">
    <strong>This Is Your First Time Connecting!</strong> please make sure to save your username and password
  </div>
    }
  }

    const loginP = () => {
      
      return <div>

      
      <form onSubmit={updateUser}  className={style.form}>
      
        <div className={style.imgcontainer}>
          <img src={logimg} alt="Avatar" className={style.avatar}/>
        </div>

        <div class="container">
          <label for="uname"><b>Username</b></label>
          <input value={userTemp} onChange={updateUserTemp} type="text" className={style.myinput} placeholder="Enter Username" name="uname" required/>

          <label for="psw"><b>Password</b></label>
          <input value={passwordTemp} onChange={updatePasswordTemp} type="password" className={style.myinput} placeholder="Enter Password" name="psw" required/>
          <div>{worngPassword()}</div>
          <button className={style.logbutton} type="submit">Login</button>
 
        </div>
      </form>



      
      </div>
      
    }

    const searchID = async () => {
        
        //localStorage.setItem('userid', userID)
        
    if(localStorage.getItem('userv') !== null ){
        setFirstTime(false);
        console.log("local");
        console.log(localStorage.getItem('userv'));
        const response = await fetch(`http://localhost:8000/users/login/${localStorage.getItem('userv')}/${localStorage.getItem('passwordv')}`);
        const data = await response.json();
        setUserNameV(localStorage.getItem('userv'));
        setPasswordV(localStorage.getItem('passwordv'));
        setLogedIn(data.answer);
        setSearch("");
        if(data.answer){
          setWp(false);
        }
    }else{
        console.log("new");
        const response = await fetch(`http://localhost:8000/users/login/${userNameV}/${passwordV}`);
        const data = await response.json();
        console.log(data);
        if(data.answer){
          
          if(data.firsttime){
            console.log("heeeeey");
            console.log(data);
            setFirstTime(true);
            setTimeout(()=> setFirstTime(false),7000);
          }
          setWp(false);
          localStorage.setItem('userv', userNameV);
          localStorage.setItem('passwordv', passwordV)
          setLogedIn(true);
        }else{
          setWp(true);
          setFirstTime(false);
          setLogedIn(false);
          setUserNameV("");
          setPasswordV("");
        }
        
      }
      //const data = await response.json();
      //console.log(response);
      
   }


    const searchUser = async () => {
        
        const cleanSearch = search.replace(/\s/g, '')
        localStorage.setItem('search', cleanSearch)
        const response = await fetch(`http://localhost:8000/users/search/${userNameV}/${cleanSearch}`);
        const data = await response.json();
        
        setUsers(data);
        
    }

    const myContent = () =>{
      
      if(logedIn){
        return cContent()
      }else{
        return loginP()
      }
    }


    const cContent = () =>{
      
        return <div>
        
        <div className="login">
          <form onSubmit={updateSearch} className="search-form">
            <input className="search-bar" type="text" value={tempSearch} onChange={updateTempSearch}></input>
            <button className="search-button" type="submit">search</button>
          </form>
        <div>
            {addProduct()}
        </div>
        <div>
            <button className={style.button} onClick={addProd} >   +   </button>
        </div>
        <div className="users">
            {users.map(user => (<User key={user.username} usr={user.username} name ={user.category} inventory={user.answer} callback = {callBackFunc} />))}
           
        </div>
       
        </div>
        <div><button className={style.logout} onClick={logoutHandler} >{userNameV} | Logout   </button></div>
        <div>{firstTimeMessage()}</div>
        </div>
      
    }

    const addProduct = () => {
        if (add) {
          return <div><ProductInput userID={userNameV} callback = {callBackFunc}/></div>;
        } 
      }
    const addProd = () => {
        setAdd(!add);
      }

    const logoutHandler = () => {
        localStorage.removeItem('userv');
        localStorage.removeItem('passwordv');
        setUserNameV("");
        setPasswordV("");
        setAdd(false);
        setUsers([]);
        setWp(false);
        localStorage.setItem('search', "beef");
        setSearch("");
        setFirstTime(false);
        setLogedIn(false);

      }


    return (
        
      <div>{myContent()}</div>
        
        
      );
}

export default Login;
