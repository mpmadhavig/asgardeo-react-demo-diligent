import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useAsgardeo, User, UserDropdown } from '@asgardeo/react'
import TokenInfo from './TokenInfo'
import REACT_LOGO from "../src/images/react-logo.png";
import FOOTER_LOGOS from "../src/images/footer.png";
import './App.css'

function App() {
  const { signInSilently, getDecodedIdToken, isSignedIn, signIn } = useAsgardeo();
  
  const [decodedIdToken, setDecodedIdToken] = useState(null);
  const [username, setUsername] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const orgIdFromUrl = urlParams.get('orgId');

  const organizations = [
    { id: 'd4c12b63-3c2c-4442-80fd-54b35f643074', name: 'Org A' },
    { id: 'c82923c3-5557-4b41-a65a-1723e1dc2550', name: 'Org B' },
    { id: '26a12cc8-030f-48af-9f69-96eb50975937', name: 'Org C' },
    { id: '5fb1c717-90df-4739-87fa-935ad646a500', name: 'Org D' },
    { id: '55c580da-1aad-437b-b419-87eee65e96c5', name: 'Org US Diligent' },
    { id: '2e369ca2-246c-4f00-a308-35748213c6d1', name: 'Org EU Diligent' }
  ];

  const handleLogin = async () => {
    try {
      const params = {};
      
      // Add username if provided
      if (username.trim()) {
        params.login_hint = username.trim();
      }
      
      // Add organization params only if an organization is selected
      if (selectedOrg) {
        params.fidp = "OrganizationSSO";
        params.orgId = selectedOrg;
      }
      
      await signIn(params);
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Sign-in failed. Please try again.');
    }
  };
  
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



  return (
    <>
      <main>
            
                  


          <SignedOut>
            <div className="container">
              <div className="header-title">
                <h1>
                    React SPA Authentication Sample
                </h1>
              </div>
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
                <div className="form-card">
                  <div className="form-container">
                    <div className="form-field">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        placeholder="Enter username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="organization" className="form-label">
                        Organization
                      </label>
                      <select
                        id="organization"
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                        data-placeholder={selectedOrg === "" ? "true" : "false"}
                        className="form-select"
                      >
                        <option value="">Select an organization...</option>
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleLogin}
                      className="primary-login-button"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <img src={FOOTER_LOGOS} className="footer-image" />
          </SignedOut>

          <SignedIn>
          <div className="user-header-container">
            <User>
              {(user) => (
                <h3>👋 Welcome back, {user?.name?.givenName && user?.name?.familyName ? `${user?.name?.givenName} ${user?.name?.familyName}` : user.userName || user.username || user.sub}</h3>
              )}
            </User>
            <UserDropdown />
          </div>
          <TokenInfo />
        </SignedIn>
      </main>
    </>
  )
}

export default App
