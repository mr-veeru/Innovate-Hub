import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/main/Main';
import Navbar from './components/Navbar';
import CreatePost from './pages/posts/CreatePost';
import Register from './pages/Register';
import MyPost from './pages/posts/MyPosts';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/main' element={<Main />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/createPost' element={<CreatePost />} />
          <Route path='/myPost' element={<MyPost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
