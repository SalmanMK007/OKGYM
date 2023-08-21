import { Route, Switch } from 'react-router-dom';

import { useUser } from '../hooks/user';
import PrivateRoute from '../components/private-route';
import Forgot from './forgot';
import SignIn from './sign-in';
import Works from './works';
import WorkEdit from './edit';
import Team from './team';

import CreateWork from './new';
import WorkDetail from './detail';
import LoadingPage from './loading';
import Contact from './contact';
import NotFound from './not-found';
import Settings from './settings';
import VerifyReset from './verify-reset';
import SignUp from './signup';
import ConfirmEmail from './confirm';
import ConfirmSuccess from './confirm-success';
import TermsOfUse from './terms-of-use';
import ResetEmail from './reset-email';
import VerificationScreen from './verification-screen';
import FameScreen from './fame-screen';
import Help from './help';

const Routes = (props) => {
    const { user } = useUser();
    return (
        <Switch>
            <Route path="/" render={ () => <LoadingPage user={user} /> } exact />
            <Route path="/team" component={ Team } exact/>
            <Route path="/contact" component= { Contact } exact/> 
            <Route path="/login" component={ SignIn } exact/>
            <Route path="/signup/:uid/:inviteCode" component={ SignUp } exact/>
            <Route path="/forgot" component={ Forgot } exact/>
            <Route path="/works/:artis_code([0-9a-zA-Z]{6,})" component={WorkDetail} exact />
            <Route path="/verify_reset/:reset_token" component={VerifyReset} exact/>
            <Route path="/users/reset-email/:uid/:token/:new_email" component={ResetEmail} exact />
            <Route path="/users/verification-action/:type/:token/:uid" component={VerificationScreen} exact />
            <Route path="/users/fame-action/:type/:token/:uid" component={FameScreen} exact />
            <Route path="/signup/confirm" component={ConfirmEmail} exact/>
            <Route path="/signup/confirm-success" component={ConfirmSuccess} exact/>
            <Route path="/terms" component={TermsOfUse} exact/>
            <PrivateRoute path="/works" exact>
                <Works />
            </PrivateRoute>
            <PrivateRoute path="/works/new" exact>
                <CreateWork />
            </PrivateRoute>
            <PrivateRoute path="/works/edit/:artis_code([0-9a-zA-Z]{6,})" exact>
                <WorkEdit />
            </PrivateRoute>
            <PrivateRoute path="/settings" exact>
                <Settings />
            </PrivateRoute>
            <PrivateRoute path="/help" exact>
                <Help />
            </PrivateRoute>
            <Route component={ NotFound }/>
        </Switch>
    )
}

export default Routes;
