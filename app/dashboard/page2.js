"use client"
import React from 'react';
import { Home, Plus, BarChart2, Download, Settings, Image } from 'lucide-react';
import { Card, CardContent } from './components/Card.js';

const Snappit = () => {
  const date = new Date('2025-02-01T16:42:00');
  
  const stats = [
    { label: 'Calories left', value: '1244' },
    { label: 'Health Score', value: '58%' },
    { label: 'Protein', value: '24g' },
    { label: 'Carbs', value: '88g' },
    { label: 'Fats', value: '24g' }
  ];

  const meals = [
    { name: 'Diced chicken', calories: 542, macros: '11g 24g 84g', time: '9:11 PM', status: 'success' },
    { name: 'Pizza', calories: 992, macros: '80g 10g 5g', time: '9:11 PM', status: 'warning' },
    { name: 'Burger', calories: 885, macros: '30g 154g 40g', time: '9:11 PM', status: 'error' }
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Snappit!</h1>
        <div className="flex gap-2">
          <Settings className="w-6 h-6" />
          <Image className="w-6 h-6" />
        </div>
      </header>

      <div className="p-4">
        <p className="text-gray-600">
          {date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
        <p className="text-gray-600">
          {date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric' 
          })}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {stats.map((stat, index) => (
            <Card key={index} className={index === 0 ? "col-span-2" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                  <div className="w-8 h-8 border-4 border-t-purple-500 border-r-purple-500 border-b-purple-200 border-l-purple-200 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">Your snaps</h2>
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-sm">Image</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{meal.name}</p>
                  <p className="text-gray-600">{meal.time}</p>
                </div>
                <p className="text-gray-600">{meal.calories} calories</p>
                <p className="text-gray-600">{meal.macros}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                meal.status === 'success' ? 'bg-green-500' : 
                meal.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <Home className="w-6 h-6" />
          <Plus className="w-6 h-6" />
          <BarChart2 className="w-6 h-6" />
        </div>
      </nav>
    </div>
  );
};

export default Snappit;