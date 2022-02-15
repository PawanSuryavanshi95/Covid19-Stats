import './App.css';
import Country from './screens/Country';
import State from './screens/State';

import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

function App() {

  var navigate = useNavigate();

  return (
        <Routes>
          <Route path="/usa" element={<Country navigate={navigate} />}></Route>
          <Route path="/usa/state/:state_code" element={<State navigate={navigate} />}></Route>
        </Routes>
  );
}

export default App;
