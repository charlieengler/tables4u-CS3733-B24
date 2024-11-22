"use client";

import { HashRouter, Routes, Route } from 'react-router-dom';

import Banner from './components/Banner';

import Administrator from './pages/Administrator';
import Consumer from './pages/Consumer';
import CreateRestaurant from './pages/CreateRestaurant';
import RestaurantManager from './pages/RestaurantManager';

export default function Home() {
    return (
        <HashRouter>
            <Banner/>
            <Routes>
                <Route element={<Consumer/>} index/>
                <Route element={<Consumer/>} path='/'/>
                <Route element={<RestaurantManager/>} path='/restaurant-manager'/>
                <Route element={<Administrator/>} path='/administrator'/>
                <Route element={<CreateRestaurant/>} path='/create-restaurant'/>
            </Routes>
        </HashRouter>
    );
}