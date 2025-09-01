'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  description: string;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:8000/api/items');
    setItems(response.data);
  };

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/items', newItem);
    setNewItem({ name: '', description: '' });
    fetchItems();
  };

  const updateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await axios.put(`http://localhost:8000/api/items/${editingItem.id}`, editingItem);
      setEditingItem(null);
      fetchItems();
    }
  };

  const deleteItem = async (id: number) => {
    await axios.delete(`http://localhost:8000/api/items/${id}`);
    fetchItems();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Items CRUD</h1>
      
      {/* Create Form */}
      <form onSubmit={createItem} className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <textarea
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </form>

      {/* Edit Form */}
      {editingItem && (
        <form onSubmit={updateItem} className="mb-6 p-4 bg-yellow-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Edit Item</h2>
          <div className="mb-2">
            <input
              type="text"
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Update
            </button>
            <button 
              type="button" 
              onClick={() => setEditingItem(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={() => setEditingItem(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}