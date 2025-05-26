import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export default function CreateQuiz() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Lấy user hiện tại
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  // Lấy danh sách môn học của user
  useEffect(() => {
    if (!user) return;
    const fetchSubjects = async () => {
      const q = query(
        collection(db, "subjects"),
        where("createdBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setSubjects(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchSubjects();
  }, [user]);

  // Lấy câu hỏi khi chọn môn học (của user)
  useEffect(() => {
    if (!subjectId || !user) {
      setQuestions([]);
      setSelectedQuestions([]);
      return;
    }
    const fetchQuestions = async () => {
      setLoading(true);
      const q = query(
        collection(db, "questions"),
        where("subjectId", "==", subjectId),
        where("createdBy", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setQuestions(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    };
    fetchQuestions();
  }, [subjectId, user]);

  const handleSelectQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !subjectId || selectedQuestions.length === 0) {
      setError("Vui lòng nhập đầy đủ thông tin và chọn ít nhất 1 câu hỏi.");
      return;
    }
    try {
      await addDoc(collection(db, "quizzes"), {
        name,
        description,
        subjectId,
        questionIds: selectedQuestions,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setSuccess("Tạo bài thi thành công!");
      setName("");
      setDescription("");
      setSubjectId("");
      setQuestions([]);
      setSelectedQuestions([]);
    } catch (err) {
      setError("Không thể tạo bài thi: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Tạo bài thi mới</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Tên bài thi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: 8, width: 220 }}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: 8, width: 220 }}
        />
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          style={{ marginRight: 8 }}
        >
          <option value="">Chọn môn học</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button type="submit">Tạo bài thi</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {loading && <p>Đang tải câu hỏi...</p>}
      {questions.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>Chọn các câu hỏi cho bài thi:</h4>
          <button
            type="button"
            onClick={() => {
              if (selectedQuestions.length === questions.length) {
                setSelectedQuestions([]);
              } else {
                setSelectedQuestions(questions.map((q) => q.id));
              }
            }}
            style={{ marginBottom: 12 }}
          >
            {selectedQuestions.length === questions.length
              ? "Bỏ chọn tất cả"
              : "Chọn tất cả"}
          </button>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questions.map((q) => (
              <li
                key={q.id}
                style={{
                  marginBottom: 8,
                  background: selectedQuestions.includes(q.id)
                    ? "#e3f7e3"
                    : "#f9f9f9",
                  borderRadius: 6,
                  padding: 8,
                  border: "1px solid #eee",
                }}
              >
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.id)}
                    onChange={() => handleSelectQuestion(q.id)}
                    style={{ marginRight: 8 }}
                  />
                  {q.questionText}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
