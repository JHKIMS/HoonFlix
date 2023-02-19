import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Header />
        <Switch>
          <Route path="/tv">
            <Tv />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path={["/", "/movies/:movieId"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </RecoilRoot>
  );
}

export default App;
