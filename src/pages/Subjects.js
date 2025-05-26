import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "subjects"),
        where("createdBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setSubjects(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err) {
      setError("Không thể tải danh sách môn học.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bạn cần đăng nhập để thêm môn học.");
      await addDoc(collection(db, "subjects"), {
        name,
        description,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setName("");
      setDescription("");
      fetchSubjects();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa môn học này?")) return;
    try {
      await deleteDoc(doc(db, "subjects", id));
      fetchSubjects();
    } catch (err) {
      setError("Không thể xóa môn học.");
    }
  };

  const handleEdit = (subject) => {
    setEditId(subject.id);
    setEditName(subject.name);
    setEditDescription(subject.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "subjects", editId), {
        name: editName,
        description: editDescription,
      });
      setEditId(null);
      setEditName("");
      setEditDescription("");
      fetchSubjects();
    } catch (err) {
      setError("Không thể cập nhật môn học.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Quản lý môn học</h2>
      <form onSubmit={handleAddSubject} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tên môn học"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Thêm môn học</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id} style={{ marginBottom: 8 }}>
              {editId === subject.id ? (
                <form onSubmit={handleUpdate} style={{ display: "inline" }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{ marginRight: 8 }}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ marginRight: 8 }}
                  />
                  <button type="submit">Lưu</button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    style={{ marginLeft: 4 }}
                  >
                    Hủy
                  </button>
                </form>
              ) : (
                <>
                  <strong>{subject.name}</strong> - {subject.description}
                  <a
                    href={`/questions?subjectId=${subject.id}`}
                    style={{ marginLeft: 8 }}
                  >
                    Quản lý câu hỏi
                  </a>
                  <button
                    onClick={() => handleEdit(subject)}
                    style={{ marginLeft: 8 }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    style={{ marginLeft: 4, color: "red" }}
                  >
                    Xóa
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
