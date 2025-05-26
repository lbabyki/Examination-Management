import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageAll() {
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const subSnap = await getDocs(collection(db, "subjects"));
      const quizSnap = await getDocs(collection(db, "quizzes"));
      setSubjects(subSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setQuizzes(quizSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError("Không thể tải dữ liệu: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa môn học này?")) return;
    try {
      await deleteDoc(doc(db, "subjects", id));
      setSuccess("Đã xóa môn học.");
      fetchAll();
    } catch (err) {
      setError("Không thể xóa môn học: " + err.message);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài thi này?")) return;
    try {
      await deleteDoc(doc(db, "quizzes", id));
      setSuccess("Đã xóa bài thi.");
      fetchAll();
    } catch (err) {
      setError("Không thể xóa bài thi: " + err.message);
    }
  };

  return (
    <div className="manageall-container">
      <h2 className="manageall-title">Quản lý tất cả môn học & bài thi</h2>
      {error && <p className="manageall-error">{error}</p>}
      {success && <p className="manageall-success">{success}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="manageall-section">
            <h3 className="manageall-section-title">Môn học</h3>
            <div className="manageall-card">
              <table className="manageall-table">
                <thead>
                  <tr>
                    <th>Tên môn học</th>
                    <th>Mô tả</th>
                    <th>Người tạo (userId)</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.description}</td>
                      <td>{s.createdBy}</td>
                      <td>
                        <button
                          className="manageall-btn-delete"
                          onClick={() => handleDeleteSubject(s.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="manageall-section">
            <h3 className="manageall-section-title">Bài thi</h3>
            <div className="manageall-card">
              <table className="manageall-table">
                <thead>
                  <tr>
                    <th>Tên bài thi</th>
                    <th>Mô tả</th>
                    <th>Môn học (subjectId)</th>
                    <th>Người tạo (userId)</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((q) => (
                    <tr key={q.id}>
                      <td>{q.name}</td>
                      <td>{q.description}</td>
                      <td>{q.subjectId}</td>
                      <td>{q.createdBy}</td>
                      <td>
                        <button
                          className="manageall-btn-delete"
                          onClick={() => handleDeleteQuiz(q.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <style>{`
      .manageall-container {
        max-width: 1000px;
        margin: 40px auto;
        background: #f7fafd;
        border-radius: 16px;
        box-shadow: 0 2px 16px #0001;
        padding: 32px 24px;
      }
      .manageall-title {
        color: #1976d2;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 32px;
        text-align: center;
      }
      .manageall-section {
        margin-bottom: 32px;
      }
      .manageall-section-title {
        color: #1976d2;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .manageall-card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 1px 8px #0001;
        padding: 16px 8px;
      }
      .manageall-table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
      }
      .manageall-table th, .manageall-table td {
        padding: 10px 8px;
        border-bottom: 1px solid #e3eaf2;
        text-align: left;
      }
      .manageall-table th {
        background: #e3eaf2;
        color: #1976d2;
        font-weight: 600;
      }
      .manageall-btn-delete {
        background: #e3eaf2;
        color: #d32f2f;
        border: none;
        border-radius: 6px;
        padding: 6px 16px;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .manageall-btn-delete:hover {
        background: #fbe9e7;
      }
      .manageall-error {
        color: #d32f2f;
        font-weight: 500;
        text-align: center;
        margin-bottom: 16px;
      }
      .manageall-success {
        color: #388e3c;
        font-weight: 500;
        text-align: center;
        margin-bottom: 16px;
      }
      @media (max-width: 700px) {
        .manageall-container {
          padding: 8px 2px;
        }
        .manageall-card {
          padding: 4px 2px;
        }
        .manageall-table th, .manageall-table td {
          padding: 6px 2px;
        }
      }
      `}</style>
    </div>
  );
}
