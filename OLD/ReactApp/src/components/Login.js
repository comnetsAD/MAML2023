import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const history = useNavigate();
    const [email, setEmail]=useState('');
    const [password, setPassword]= useState('');
    const [username, setUsername]= useState('');
    const login = e =>{
        e.preventDefault();
        const data = {
            "username": username,
            "email": email,
            "password": password
        }
        fetch('http://10.224.41.106:8080/api/users/login',{
                'method':'POST',
                 headers : {
                'Content-Type':'application/json',
          },
          body:JSON.stringify(data)
        }).then(response => {
            if (response.status == 200) {
                console.log(response.json())
                history('/editor');
            } else {
                alert("Login failed:", response.status)
            }
        });
    }

    const register = e =>{
        e.preventDefault();
        const data = {
            "username": username,
            "email": email,
            "password": password
        }
        fetch('http://10.224.41.106:8080/api/users/register',{
                'method':'POST',
                 headers : {
                'Content-Type':'application/json',
          },
          body:JSON.stringify(data)
        }).then(response => {
            if (response.status == 200) {
                history('/editor');
            } else {
                alert("Login failed:", response.status)
            }
        });
    }

    return (
        <div className="login">
           
            <div className='login__container'>
                <h1>Sign-in</h1>
                <form>
                    <h5>Username</h5>
                    <input type='text' value={username} onChange={e=>setUsername(e.target.value)} />
                    <h5>E-mail</h5>
                    <input type='text' value={email} onChange={e=>setEmail(e.target.value)} />

                    <h5>Password</h5>
                    <input type='password' value={password} onChange={e=>setPassword(e.target.value)} />
                    <button type='submit'  onClick={login} className='login__signInButton'>Sign In</button>
                </form>
                
                <button type='submit'  onClick={register} className='login__registerButton'>Create Your Account</button>
            </div>
        </div>
    )
}

export default Login