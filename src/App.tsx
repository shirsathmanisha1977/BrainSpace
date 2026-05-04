/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Add from './pages/Add';
import Settings from './pages/Settings';
import CategoryView from './pages/CategoryView';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import AllItems from './pages/AllItems';
import Recent from './pages/Recent';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<Add />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/all" element={<AllItems />} />
        <Route path="/recent" element={<Recent />} />
        <Route path="/category/:id" element={<CategoryView />} />
      </Route>
    </Routes>
  );
}
