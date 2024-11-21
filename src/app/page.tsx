"use client";

import { HashRouter, Routes, Route } from 'react-router-dom';

import Banner from './components/Banner';

import Consumer from './pages/Consumer';
import RestaurantManager from './pages/RestaurantManager';
import Administrator from './pages/Administrator';

export default function Home() {
    return (
        <HashRouter>
            <Banner/>
            <Routes>
                <Route element={<Consumer/>} index/>
                <Route element={<Consumer/>} path='/'/>
                <Route element={<RestaurantManager/>} path='/restaurant-manager'/>
                <Route element={<Administrator/>} path='/administrator'/>
            </Routes>
        </HashRouter>
    );
}