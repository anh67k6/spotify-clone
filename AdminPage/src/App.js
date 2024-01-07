import { Outlet } from 'react-router-dom';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

function App() {
  return (
    <div className="">
      <div className="flex overflow-scroll ">
        <div className="basis-[12%] h-[100vh]">
          <Sidebar />
        </div>
        <div className="basis-[88%] border overflow-scroll h-[100vh]">
          <Header />
          <div>
            <Outlet>

            </Outlet>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
