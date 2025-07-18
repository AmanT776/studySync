import React from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, BookIcon } from 'lucide-react';

const StudyRoomCard = ({
  id,
  name,
  university,
  department,
  course,
  activeUsers,
  totalMembers
}) => {
  return (
    <Link to={`/room/${id}`} className="block">
      <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{course}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {department}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{university}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <UsersIcon className="mr-1 h-4 w-4 text-gray-400" />
              <span>
                {activeUsers} active / {totalMembers} members
              </span>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <BookIcon className="mr-1 h-4 w-4" />
              <span>Join Room</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudyRoomCard;
