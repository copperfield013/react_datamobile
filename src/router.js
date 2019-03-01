import React from 'react'
import { HashRouter, Route , Switch, Redirect} from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Home from './pages/home'
import ActTable from './pages/actTable'

export default class iRouter extends React.Component{
   
    render(){
        return (
            <HashRouter>
                <App>                  
                    <Switch>                  
                        <Route path="/login"  component={Login}/>
                        <Route path='/' render={()=>
                            <Switch>
                                <Route path='/home' component={Home} />
                                <Route path="/:menuId" component={ActTable} exact />
                                <Redirect to="/login" />
                            </Switch>
                        }/>
                    </Switch>
                </App>
            </HashRouter>
        )
    }
}