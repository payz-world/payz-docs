import { Redirect, Route, Switch } from "wouter";
import { DOC_ROUTES, DocumentationSite } from "./DocumentationSite";

export default function App() {
  return (
    <Switch>
      {DOC_ROUTES.map((path) => (
        <Route key={path} path={path} component={DocumentationSite} />
      ))}
      <Route>
        <Redirect to="/docs" />
      </Route>
    </Switch>
  );
}
