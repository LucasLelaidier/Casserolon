import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
 
import ScrollToTop from 'components/scrollToTop/ScrollToTop';
import Skeleton from 'components/skeleton/Skeleton';

import Accueil from 'pages/accueil/Accueil';

export default function MainRouter () {
    return (
        <Router>
            <ScrollToTop>
                <Skeleton>
                    <Route exact path="/" component={Accueil}/>
                </Skeleton>
            </ScrollToTop>
        </Router>
    )
}