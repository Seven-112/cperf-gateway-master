import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

import DevTools from './config/devtools';
import initStore from './config/store';
import { registerLocale } from './config/translation';
import setupAxiosInterceptors from './config/axios-interceptor';
import { clearAuthentication } from './shared/reducers/authentication';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { loadIcons } from './config/icon-loader';
import { MuiThemeProvider } from '@material-ui/core';
import theme from './theme/index';
import store from './config/full-accessible-store';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

loadIcons();

const rootEl = document.getElementById('root');

const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        <div>
          {/* If this slows down the app in dev disable it and enable when required  */}
          {devTools}
          <MuiThemeProvider theme = {theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DndProvider backend={HTML5Backend}>
                <Component />
              </DndProvider>
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </div>
      </Provider>
    </ErrorBoundary>,
    rootEl
  );

render(AppComponent);
