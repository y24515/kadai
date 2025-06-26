// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';
import FindUser from './find';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null); // Firebaseユーザー
  const [dbUsers, setdbUsers] = useState([]); // Firestoreのデータ

  useEffect(() => {
    // Firestoreからusersコレクションを取得
    const fetchUsers = async () => {
      try {
        const usersCol = collection(db, 'mydata');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setdbUsers(userList);
      } catch (error) {
        console.error("データ取得エラー :", error);
      }
    };

    // 認証状態を監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    fetchUsers();
    return () => unsubscribe();
  }, []);

  // Googleログイン処理
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("ログインエラー :", error);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー :", error);
    }
  };

  return (
    <Router>
      <Navigation />

      <div className="p-4 flex justify-between items-center bg-gray-100">
        {user ? (
          <>
            <h1>こんにちは、{user.displayName} さん</h1>
            <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded">ログアウト</button>
          </>
        ) : (
          <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Googleでログイン</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4">ToDoリスト</h1>

            {user ? (
              <table className='bg-white border border-gray-600 w-full'>
                <thead>
                  <tr className='border-b-2 border-gray-400'>
                    <th className='p-4'>番号</th>
                    <th className='p-4'>時間</th>
                    <th className='p-4'>やること</th>
                  </tr>
                </thead>

                <tbody>
  {dbUsers
    .sort((a, b) => a.no - b.no) // 番号順に並べる
    .map((user) => (
      <tr key={user.id} className='border-b border-gray-300'>
        <td className='p-4'>{user.no}</td> {/* ← ここ */}
        <td className='p-4'>{user.by}</td>
        <td className='p-4'>{user.yaru}</td>
      </tr>
  ))}
</tbody>

              </table>
            ) : (
              <p className="text-gray-600 mt-4">ログインするとデータが見られます。</p>
            )}
          </div>
        } />

        {/* 認証によって分岐 */}
        {user ? (
<>
<Route path="/add" element={<AddUser />} />
<Route path="/delete" element={<DeleteUser />} />
<Route path="/find" element={<FindUser />} />
</>
) : (
<>
<Route path="/add" element={<p>ログインしてください </p>} />
<Route path="/delete" element={<p>ログインしてください </p>} />
<Route path="/find" element={<p>ログインしてください </p>} />
</>
)}
      </Routes>
    </Router>
  );
}

export default App;
