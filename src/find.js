// src/find.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Navigation from './components/Navigation';

function FindUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'mydata');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    const filtered = users.filter(user =>
      user.by.toLowerCase().includes(kw.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h2>時間検索ページ</h2>
      <input
        type="text"
        placeholder="名前で検索"
        value={keyword}
        onChange={handleSearch}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            {user.by} - {user.yaru} 
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FindUserPage;
