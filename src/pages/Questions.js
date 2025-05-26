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
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.questions-modern-header h2 {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}
.questions-modern-header span {
  color: var(--primary);
}
.questions-modern-form {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 1px 8px #0001;
  padding: 24px 18px 18px 18px;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.questions-modern-form-row {
  display: flex;
  gap: 12px;
}
.questions-modern-input {
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 8px 12px;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text);
}
.questions-modern-options-row {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}
.questions-modern-option-input {
  display: flex;
  align-items: center;
  gap: 4px;
}
.questions-modern-radio {
  accent-color: var(--primary);
}
.questions-modern-option-text {
  width: 110px;
}
.questions-modern-list {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 1px 8px #0001;
  padding: 18px 10px 10px 10px;
  margin-bottom: 0;
}
.questions-modern-empty {
  color: var(--text-secondary);
  text-align: center;
  padding: 32px 0;
}
.questions-modern-table {
  width: 100%;
  border-collapse: collapse;
}
.questions-modern-table th, .questions-modern-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
.questions-modern-table th {
  background: var(--gray);
  color: var(--primary);
  font-weight: 700;
  font-size: 1.05rem;
}
.questions-modern-table tr:last-child td {
  border-bottom: none;
}
.questions-modern-question-text {
  font-weight: 600;
  color: var(--text);
}
.questions-modern-options-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.questions-modern-options-list li {
  margin-bottom: 4px;
  color: var(--text);
  font-size: 1rem;
}
.questions-modern-option-label {
  font-weight: 600;
  margin-right: 2px;
}
.questions-modern-correct {
  color: var(--success);
  font-weight: 600;
}
.questions-modern-correct-badge {
  background: var(--success);
  color: #fff;
  border-radius: 6px;
  font-size: 0.85em;
  padding: 2px 8px;
  margin-left: 6px;
}
.questions-modern-error {
  color: var(--danger);
  margin-bottom: 8px;
}
.btn-sm {
  font-size: 0.98rem;
  padding: 6px 14px;
  border-radius: 7px;
}
@media (max-width: 900px) {
  .questions-modern-container {
    padding: 8px 0;
  }
  .questions-modern-form, .questions-modern-list {
    padding: 10px 2px 8px 2px;
  }
  .questions-modern-table th, .questions-modern-table td {
    padding: 6px 2px;
  }
  .questions-modern-options-row {
    flex-direction: column;
    gap: 6px;
  }
}
`;
