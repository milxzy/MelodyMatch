import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Header from './Header';

import { Box, VStack, Heading, Image, Badge, Text, Flex, Button, Center, Stack } from '@chakra-ui/react';

const BeRegister= () => {
const navigate = useNavigate()
const [email, setEmail] = useState('') 
const [pass, setPass] = useState('')
const [confirmPass, setConfirmPass] = useState('')
const [loginName, setLoginName] = useState('')
const [error, setError] = useState(false)
const [allowedAccess, setAllowedAccess] = useState(false)

useEffect(() => {
  setAllowedAccess(false)
  const userInfo = localStorage.getItem("userInfo");
  if(userInfo){
    navigate("/spotify")
  }
})

  

const submitHandler = async (e) => {
  e.preventDefault()
  console.log(email, pass, loginName)
  if (pass !== confirmPass) {
    alert('Passwords do not match')
  } else {
    console.log('all good to go' + email)
  }
  try{
    const config = {
      headers: {
        "Content-type": "application/json"
      },
    };
    
    const {data} = await axios.post(
      "http://localhost:4000/registeruser",
      {
         loginName, email, pass, allowedAccess,
      },
      config
    )
    console.log(data)
localStorage.setItem("userInfo", JSON.stringify(data))
console.log('Succsesful registration')

// if user allowedaccess === false, then take them to a landing page that explains they have to wait 24 hours for access
// automate a job that will get the blacklisted users and automate them


navigate("/whitelist")

  } catch (error){

    console.error(error)
setError(error.response.data.message)
  }
}



  return (
    <>
    <Header></Header>
     <Flex alignContent="center" bg="#232136" justifyContent="center" minHeight="100vh">
      <Center>

    <form onSubmit={submitHandler}  >
        
    

        <div className="form-group">
          <label style={{color: "#eb6f92"}} color="" htmlFor="loginName">Name</label>
          <input
            type="text"
            className="form-control"
            id="loginName"
            value={loginName}
            placeholder="Name"
            onChange={(e) => setLoginName( e.target.value )}
          />
        </div>

    
        <div className="form-group">
          <label style={{color: "#eb6f92"}}  htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail( e.target.value )}
          />
        </div>
        
        
        <div className="form-group">
          <label style={{color: "#eb6f92"}} htmlFor="pass">Pass</label>
          <input
            type="password"
            className="form-control"
            id="pass"
            value={pass}
            placeholder="Pass"
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
    
         
        <div className="form-group">
          <label style={{color: "#eb6f92"}} htmlFor="pass">Confirm Pass</label>
          <input
            type="password"
            className="form-control"
            id="confirmPass"
            value={confirmPass}
            placeholder="Pass"
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>
    

<button style={{
  backgroundColor:"lightblue",
  padding: "2%",
  marginTop: "5%",
  borderRadius: "10%"
  }} onClick={submitHandler}>Submit</button>

        </form>  

      </Center>
     </Flex>
    </>
  )
}

export default BeRegister