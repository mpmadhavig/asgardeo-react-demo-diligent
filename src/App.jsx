import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, useAsgardeo, User, UserDropdown } from '@asgardeo/react'
import TokenInfo from './TokenInfo'
import REACT_LOGO from "../src/images/react-logo.png";
import './App.css'
import { useEffect } from 'react';

function App() {
  const { signInSilently, getDecodedIdToken, isSignedIn, signIn } = useAsgardeo();
  
  const [decodedIdToken, setDecodedIdToken] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const orgIdFromUrl = urlParams.get('orgId');
  
  useEffect(() => {
    (async () => {
      try {
        const params = {};
        
        if (orgIdFromUrl) {
          params.fidp = "OrganizationSSO";
          params.orgId = orgIdFromUrl;
        }

        const response = await signInSilently(params);

        if (response === true) {
          return;
        }

        console.debug('No session found...');
        
        if (orgIdFromUrl) {
          console.debug('Organization ID is present in URL. Redirecting to sign-in with Organization SSO...');

          await signIn(params);
        }
      } catch(error) {
        console.error('Error during silent sign-in:', error);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (isSignedIn) {
        const response = await getDecodedIdToken();
        
        setDecodedIdToken(response);
      }
    })();
  }, [getDecodedIdToken, isSignedIn]);

  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <header>
        
      </header>
      <main>
        <div className="content">
              <div className="home-image">
                  <img alt="react-logo" src={ REACT_LOGO } className="react-logo-image logo"/>
              </div>
              <h4 className={ "spa-app-description" }>
                  Sample demo to showcase authentication for a Single Page Application
                  via the OpenID Connect Authorization Code flow,
                  which is integrated using the&nbsp;
                  <a href="https://www.npmjs.com/package/@asgardeo/react" target="_blank" rel="noreferrer noopener">
                      Asgardeo React SDK
                  </a>.
              </h4>
              <SignedIn>
          <UserDropdown menuItems={[
            {
              label: 'My Account',
              onClick: () => window.open(`${import.meta.env.VITE_ASGARDEO_MYACCOUNT_URL}/${decodedIdToken?.org_id}`, '_blank')
            }
          ]} />
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col gap-2 p-4">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Enter text : 
            </label>
            <input
              id="name"
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Add username..."
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>

            <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "d4c12b63-3c2c-4442-80fd-54b35f643074"}}>
            Org A
          </SignInButton>
          <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "c82923c3-5557-4b41-a65a-1723e1dc2550"}}>
            Org B
          </SignInButton>
          <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "26a12cc8-030f-48af-9f69-96eb50975937"}}>
            Org C
          </SignInButton>
          <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "5fb1c717-90df-4739-87fa-935ad646a500"}}>
            Org D
          </SignInButton>
          <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "55c580da-1aad-437b-b419-87eee65e96c5"}}>
            Org US Diligent
          </SignInButton>
          <SignInButton signInOptions={{
            login_hint: value,
            fidp: "OrganizationSSO",
            orgId: "2e369ca2-246c-4f00-a308-35748213c6d1"}}>
            Org EU Diligent
          </SignInButton>

          </div>
          
        </SignedOut>
        </div>
        <SignedIn>
          <User>
            {(user) => (
              <div>
                <h3>👋 Welcome back, {user?.name?.givenName && user?.name?.familyName ? `${user?.name?.givenName} ${user?.name?.familyName}` : user.userName || user.username || user.sub}</h3>
              </div>
            )}
          </User>
          <TokenInfo />
        </SignedIn>
      </main>
    </>
  )
}

export default App
