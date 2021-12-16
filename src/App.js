import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import NotFound from './components/404/NotFound';
import Header from './components/Header';
import Home from './components/Home';
import WordPage from './components/WordPage';

function App() {
  return (
    <>
    <Header />

    <div className='container'>
      <Routes>
        <Route path="/" exact element={<Home />}></Route>
        <Route path="*" exact element={<NotFound />}></Route>
        <Route path="/word/:word" exact element={<WordPage />}></Route>
      </Routes>
    </div>
    </>
  );
}

export default App;
