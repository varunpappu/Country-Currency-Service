import * as React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import CountryCanvas from '../country-canvas';

export const Routes = (): React.ReactElement => {
  return (
    <BrowserRouter forceRefresh>
      <Switch>
        <Route exact path="/" component={CountryCanvas} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
