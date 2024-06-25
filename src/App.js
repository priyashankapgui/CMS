import { BrowserRouter as Router } from "react-router-dom";
import { SidebarRouter } from "./Routers/SidebarRouter";
// import { LoginRouter } from "./Routers/LoginRouter";


function App() {
  return (
    <Router>
      <SidebarRouter />
    </Router>
  );
}

export default App;