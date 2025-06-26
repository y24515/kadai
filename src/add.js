import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [by, setBy] = useState('');
  const [yaru, setYaru] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 番号を決める：今の最大noを調べる
      const usersCol = collection(db, 'mydata');
      const snapshot = await getDocs(usersCol);
      const users = snapshot.docs.map(doc => doc.data());

      let maxNo = 0; 
      users.forEach(u => {
        if (u.no && Number(u.no) > maxNo) {
          maxNo = Number(u.no);
        }
      });

      const nextNo = (maxNo + 1).toString().padStart(2, '0');

      await addDoc(usersCol, {
        by,
        yaru,
        no: nextNo
      });

      alert('ToDoを追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div>
      <h1>ToDo追加</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>時間：</label>
          <input value={by} onChange={(e) => setBy(e.target.value)} required />
        </div>
        <div>
          <label>やること：</label>
          <input value={yaru} onChange={(e) => setYaru(e.target.value)} required />
        </div>
        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default AddUser;
