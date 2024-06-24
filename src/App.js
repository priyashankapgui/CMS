import { BrowserRouter as Router } from "react-router-dom";
import { SidebarRouter } from "./Routers/SidebarRouter";



function App() {
  return (
    <Router>
      <SidebarRouter />
    </Router>
  );
}

export default App;