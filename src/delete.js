import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function DeleteUser() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const usersCol = collection(db, 'mydata');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'mydata', id));
      alert('削除しました');

      // 番号を詰め直す処理
      const snapshot = await getDocs(collection(db, 'mydata'));
      const docs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.no - b.no);

      for (let i = 0; i < docs.length; i++) {
        const newNo = (i + 1).toString().padStart(2, '0'); // 03からスタート
        await updateDoc(doc(db, 'mydata', docs[i].id), { no: newNo });
      }

      fetchUsers(); // 再取得
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center">
      <h2>ToDo削除ページ</h2>
      <ul>
        {users
          .sort((a, b) => a.no - b.no)
          .map(user => (
            <li key={user.id}>
              {user.no} - {user.by} - {user.yaru}
              &nbsp;
              <button onClick={() => deleteUser(user.id)}>削除</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteUser;
