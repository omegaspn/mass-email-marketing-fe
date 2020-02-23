import React, { lazy } from "react";
import { HashRouter, Route } from "react-router-dom";

const SendMail = lazy(() => import("./pages/SendMail"));

const App: React.FC = () => {
  return (
    <div className="App">
      <HashRouter>
        <React.Suspense fallback={<></>}>
          <Route exact path="/" component={SendMail} />
        </React.Suspense>
      </HashRouter>
    </div>
  );
};

export default App;
