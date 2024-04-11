import { BrowserRouter as Router } from "react-router-dom";
import { SidebarRouter } from "./Routers/SidebarRouter";
import { LoginRouter } from "./Routers/LoginRouter";

function App() {
  return (
    <Router>
      <SidebarRouter />
      <LoginRouter/>
    </Router>
  );
}

export default App;