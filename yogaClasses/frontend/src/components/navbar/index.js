import React,{useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container'
import { Button } from 'react-bootstrap';
const Header = (props) => {
    const navigate = useNavigate();
    const localData = localStorage.getItem("visualUserInfo");
    const userInfo = localData ? JSON.parse(localData) : null;
    const userName = userInfo?.name;
   const userEmail = userInfo?.email;
    useEffect(() => {
        if (!userInfo) {
          navigate("/");
        }
        // eslint-disable-next-line
      }, [userInfo]);

      const logoutHandler = async () => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          localStorage.removeItem('visualUserInfo')
        }
        catch (e) {
          console.log(e)
        }
        finally{
          navigate("/");
        }
      }
    
    return (
        <>
            <Navbar className='shadow'>
                <Container>
                    <Navbar.Brand href="/" className='logo-text'>VISUAL</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {userName}&nbsp;&nbsp;
                        </Navbar.Text>
                        <Button onClick={logoutHandler}>Logout</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;