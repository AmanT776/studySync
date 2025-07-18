import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, PlusIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import StudyRoomCard from '../components/StudyRoomCard';
import Button from '../components/Button';
import api from '../api';
import { useUser } from '../UserContext';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        setError('Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    const name = prompt('Enter room name:');
    if (!name || !user) return;

    try {
      const res = await api.post('/rooms', {
        name,
        userId: user.id,
      });
      setRooms(prev => [...prev, res.data]);
    } catch (err) {
      alert('Failed to create room');
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back! You have a 5-day study streak going.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="mr-2 flex items-center text-orange-500 font-medium">
                <div className="h-5 w-5 mr-1" />
                5 day streak
              </span>
              <Link to="/progress">
                <Button variant="outline" size="sm">View Progress</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Create Room */}
        <div className="px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative rounded-md shadow-sm w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                placeholder="Search for rooms by name, course, or university..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={handleCreateRoom}>
              <PlusIcon className="h-5 w-5 mr-1" />
              Create Study Room
            </Button>
          </div>
        </div>

        {/* Study Rooms Grid */}
        <div className="px-4 sm:px-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Study Rooms</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map(room => (
              <StudyRoomCard
                key={room._id}
                id={room._id}
                name={room.name}
                university=""
                department=""
                course=""
                activeUsers={room.members?.length || 0}
                totalMembers={room.members?.length || 0}
              />
            ))}
          </div>
          {filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No study rooms found matching your search.</p>
            </div>
          )}
        </div>

        {/* Recommended Rooms */}
        <div className="px-4 sm:px-0 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Study Rooms</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StudyRoomCard
              id="5"
              name="Advanced Biology"
              university="Addis Ababa University"
              department="Biology"
              course="BIO301"
              activeUsers={8}
              totalMembers={22}
            />
            <StudyRoomCard
              id="6"
              name="English Literature"
              university="Bahir Dar University"
              department="Literature"
              course="ENG202"
              activeUsers={4}
              totalMembers={16}
            />
            <StudyRoomCard
              id="7"
              name="Introduction to Psychology"
              university="Jimma University"
              department="Psychology"
              course="PSY101"
              activeUsers={6}
              totalMembers={19}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
