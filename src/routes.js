import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'

import ScrollToTop from 'components/scrollToTop/ScrollToTop';
import Skeleton from 'components/skeleton/Skeleton';

import Accueil from 'pages/accueil/Accueil';
import Recette from 'pages/recette/Recette';
import Edit from 'pages/edit/Edit';

export default function MainRouter () {
    return (
        <Router>
            <ToastProvider placement="top-center">
                <ScrollToTop>
                    <Skeleton>
                        <Route exact path="/" component={Accueil}/>
                        <Route path="/recette/:id" component={Recette}/>
                        <Route path="/add" component={Edit}/>
                        <Route path="/edit/:id" component={Edit}/>
                    </Skeleton>
                </ScrollToTop>
            </ToastProvider>
        </Router>
    )
}