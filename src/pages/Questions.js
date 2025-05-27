import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  getDoc,
} from "firebase/firestore";

export default function Questions() {
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get("subjectId");
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editCorrectIndex, setEditCorrectIndex] = useState(0);

  useEffect(() => {
    if (!subjectId) return;
    const fetchSubject = async () => {
      const docRef = doc(db, "subjects", subjectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setSubject(docSnap.data());
    };
    fetchSubject();
  }, [subjectId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "questions"),
        where("subjectId", "==", subjectId)
      );
      const querySnapshot = await getDocs(q);
      setQuestions(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err) {
      setError("Không thể tải danh sách câu hỏi.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (subjectId) fetchQuestions();
    // eslint-disable-next-line
  }, [subjectId]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Bạn cần đăng nhập để thêm câu hỏi.");
      await addDoc(collection(db, "questions"), {
        subjectId,
        questionText,
        options: options.map((text, idx) => ({
          text,
          isCorrect: idx === correctIndex,
        })),
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
      fetchQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;
    try {
      await deleteDoc(doc(db, "questions", id));
      fetchQuestions();
    } catch (err) {
      setError("Không thể xóa câu hỏi.");
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setEditQuestionText(q.questionText);
    setEditOptions(q.options.map((opt) => opt.text));
    setEditCorrectIndex(q.options.findIndex((opt) => opt.isCorrect));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "questions", editId), {
        questionText: editQuestionText,
        options: editOptions.map((text, idx) => ({
          text,
          isCorrect: idx === editCorrectIndex,
        })),
      });
      setEditId(null);
      setEditQuestionText("");
      setEditOptions(["", "", "", ""]);
      setEditCorrectIndex(0);
      fetchQuestions();
    } catch (err) {
      setError("Không thể cập nhật câu hỏi.");
    }
  };

  if (!subjectId) return <p>Không tìm thấy môn học.</p>;
  // thêm commment
  return (
    <div className="questions-modern-container">
      <div className="questions-modern-header">
        <h2>
          📝 Quản lý câu hỏi cho môn:{" "}
          <span>{subject ? subject.name : subjectId}</span>
        </h2>
      </div>
      <form onSubmit={handleAddQuestion} className="questions-modern-form card">
        <div className="questions-modern-form-row">
          <input
            type="text"
            placeholder="Nội dung câu hỏi"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            className="questions-modern-input"
          />
        </div>
        <div className="questions-modern-options-row">
          {options.map((opt, idx) => (
            <span key={idx} className="questions-modern-option-input">
              <input
                type="radio"
                name="correct"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
                className="questions-modern-radio"
              />
              <input
                type="text"
                placeholder={`Đáp án ${idx + 1}`}
                value={opt}
                onChange={(e) => {
                  const newOpts = [...options];
                  newOpts[idx] = e.target.value;
                  setOptions(newOpts);
                }}
                required
                className="questions-modern-input questions-modern-option-text"
              />
            </span>
          ))}
        </div>
        <button type="submit" className="btn-primary">
          Thêm câu hỏi
        </button>
      </form>
      {error && <p className="questions-modern-error">{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="questions-modern-list card">
          {questions.length === 0 ? (
            <div className="questions-modern-empty">Chưa có câu hỏi nào.</div>
          ) : (
            <table className="questions-modern-table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Câu hỏi</th>
                  <th>Đáp án</th>
                  <th style={{ width: 120 }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      {editId === q.id ? (
                        <input
                          type="text"
                          value={editQuestionText}
                          onChange={(e) => setEditQuestionText(e.target.value)}
                          required
                          className="questions-modern-input"
                        />
                      ) : (
                        <span className="questions-modern-question-text">
                          {q.questionText}
                        </span>
                      )}
                    </td>
                    <td>
                      {editId === q.id ? (
                        <div className="questions-modern-options-row">
                          {editOptions.map((opt, idx) => (
                            <span
                              key={idx}
                              className="questions-modern-option-input"
                            >
                              <input
                                type="radio"
                                name="editCorrect"
                                checked={editCorrectIndex === idx}
                                onChange={() => setEditCorrectIndex(idx)}
                                className="questions-modern-radio"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...editOptions];
                                  newOpts[idx] = e.target.value;
                                  setEditOptions(newOpts);
                                }}
                                required
                                className="questions-modern-input questions-modern-option-text"
                              />
                            </span>
                          ))}
                        </div>
                      ) : (
                        <ul className="questions-modern-options-list">
                          {q.options.map((opt, idx) => (
                            <li
                              key={idx}
                              className={
                                opt.isCorrect ? "questions-modern-correct" : ""
                              }
                            >
                              <span className="questions-modern-option-label">
                                {String.fromCharCode(65 + idx)}.
                              </span>{" "}
                              {opt.text}{" "}
                              {opt.isCorrect && (
                                <span className="questions-modern-correct-badge">
                                  Đúng
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td>
                      {editId === q.id ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            className="btn-success btn-sm"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="btn-secondary btn-sm"
                            style={{ marginLeft: 6 }}
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(q)}
                            className="btn-primary btn-sm"
                            style={{ marginRight: 6 }}
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="btn-danger btn-sm"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <style>{questionsModernStyle}</style>
    </div>
  );
}
const questionsModernStyle = `
.questions-modern-container {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0f6ff;
}

.questions-modern-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #007bff;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.1);
  margin-bottom: 2rem;
}

.questions-modern-form-row,
.questions-modern-options-row {
  margin-bottom: 1rem;
}

.questions-modern-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d0e7ff;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.questions-modern-option-input {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.questions-modern-radio {
  margin-right: 0.5rem;
  transform: scale(1.2);
  accent-color: #007bff;
}

.questions-modern-option-text {
  flex: 1;
}

.btn-primary, .btn-success, .btn-danger, .btn-secondary {
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.questions-modern-error {
  color: red;
  margin-bottom: 1rem;
}

.questions-modern-empty {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.questions-modern-table {
  width: 100%;
  border-collapse: collapse;
}

.questions-modern-table th,
.questions-modern-table td {
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem;
  vertical-align: top;
}

.questions-modern-options-list {
  list-style: none;
  padding-left: 0;
}

.questions-modern-options-list li {
  margin-bottom: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  background-color: #f5faff;
}

.questions-modern-option-label {
  font-weight: bold;
  margin-right: 0.25rem;
}

.questions-modern-correct {
  background-color: #d0f0ff;
  border-left: 4px solid #007bff;
}

.questions-modern-correct-badge {
  background-color: #007bff;
  color: white;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.questions-modern-question-text {
  font-weight: 500;
}
`;
