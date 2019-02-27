import React from 'react'
import { HashRouter, Route , Switch, Redirect} from 'react-router-dom'
import App from './App'
import Login from './pages/login'

export default class iRouter extends React.Component{
   
    render(){
        return (
            <HashRouter>
                <App>                  
                    <Switch>                  
                        <Route path="/login"  component={Login}/>
                        <Route path='/' render={()=>
                            <Switch>
                                <Redirect to="/login" />
                            </Switch>
                        }/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}