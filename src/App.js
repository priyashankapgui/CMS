import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import createRoutes from './routes';

function App() {
  return (
    <div>
     <Router>
      {createRoutes()}
    </Router>

    </div>
  );
}

export default App;
