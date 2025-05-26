import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewWrong, setReviewWrong] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState([]);

  // Lấy danh sách bài thi
  useEffect(() => {
    const fetchQuizzes = async () => {
      const q = query(collection(db, "quizzes"));
      const querySnapshot = await getDocs(q);
      setQuizzes(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchQuizzes();
  }, []);

  // Lấy câu hỏi của bài thi khi chọn
  const fetchQuestions = async (quiz) => {
    setLoading(true);
    const qs = [];
    for (const qid of quiz.questionIds) {
      const qDoc = await getDoc(doc(db, "questions", qid));
      if (qDoc.exists()) qs.push({ id: qid, ...qDoc.data() });
    }
    setQuestions(qs);
    setLoading(false);
  };

  // Bắt đầu làm bài
  const startQuiz = async () => {
    setAnswers([]);
    setScore(0);
    setCurrent(0);
    setShowResult(false);
    setReviewWrong(false);
    setWrongIndexes([]);
    await fetchQuestions(selectedQuiz);
  };

  // Chọn đáp án
  const handleAnswer = (idx) => {
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
  };

  // Nộp bài
  const submitQuiz = () => {
    let correct = 0;
    const wrong = [];
    questions.forEach((q, i) => {
      const correctIdx = q.options.findIndex((opt) => opt.isCorrect);
      if (answers[i] === correctIdx) correct++;
      else wrong.push(i);
    });
    setScore(correct);
    setWrongIndexes(wrong);
    setShowResult(true);
  };

  // Ôn tập lại câu sai
  const reviewWrongQuestions = () => {
    setQuestions(wrongIndexes.map((i) => questions[i]));
    setAnswers([]);
    setCurrent(0);
    setShowResult(false);
    setReviewWrong(true);
    setWrongIndexes([]);
  };

  // Làm lại bài thi
  const restartQuiz = async () => {
    await startQuiz();
  };

  // Progress bar
  const progress = questions.length
    ? ((current + 1) / questions.length) * 100
    : 0;

  // Giao diện chọn bài thi
  if (!selectedQuiz) {
    const filtered = quizzes.filter((q) =>
      q.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="quiz-modern-container">
        <div className="quiz-modern-header">
          <h2>📝 Danh sách bài thi</h2>
          <input
            type="text"
            placeholder="Tìm kiếm bài thi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="quiz-modern-search"
          />
        </div>
        <div className="quiz-modern-list">
          {filtered.map((quiz) => (
            <div key={quiz.id} className="quiz-modern-card card">
              <div className="quiz-modern-card-title">{quiz.name}</div>
              <div className="quiz-modern-card-desc">{quiz.description}</div>
              <button
                className="btn-primary"
                onClick={() => setSelectedQuiz(quiz)}
              >
                Bắt đầu làm bài
              </button>
            </div>
          ))}
        </div>
        <style>{quizModernStyle}</style>
      </div>
    );
  }

  // Đang tải câu hỏi
  if (loading) return <p>Đang tải câu hỏi...</p>;

  // Nếu chưa có câu hỏi, hiển thị nút bắt đầu
  if (!questions.length && selectedQuiz) {
    return (
      <div className="quiz-modern-container">
        <div className="quiz-modern-card card" style={{ textAlign: "center" }}>
          <h2>{selectedQuiz.name}</h2>
          <div className="quiz-modern-card-desc">
            {selectedQuiz.description}
          </div>
          <button className="btn-primary" onClick={startQuiz}>
            Bắt đầu làm bài
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSelectedQuiz(null)}
            style={{ marginLeft: 8 }}
          >
            Quay lại
          </button>
        </div>
        <style>{quizModernStyle}</style>
      </div>
    );
  }

  // Hiển thị kết quả
  if (showResult) {
    return (
      <div className="quiz-modern-container">
        <div className="quiz-modern-card card" style={{ textAlign: "center" }}>
          <h2>
            Kết quả: {score} / {questions.length}
          </h2>
          <div className="quiz-modern-result-list">
            {questions.map((q, i) => {
              const correctIdx = q.options.findIndex((opt) => opt.isCorrect);
              const isCorrect = answers[i] === correctIdx;
              return (
                <div
                  key={q.id}
                  className={`quiz-modern-result-item${
                    isCorrect ? " correct" : " wrong"
                  }`}
                >
                  <div className="quiz-modern-question">{q.questionText}</div>
                  <div className="quiz-modern-answer">
                    Đáp án của bạn:{" "}
                    <b>
                      {answers[i] !== undefined
                        ? String.fromCharCode(65 + answers[i])
                        : "(bỏ qua)"}
                    </b>
                    {isCorrect ? (
                      <span className="quiz-modern-correct"> ✅</span>
                    ) : (
                      <span className="quiz-modern-wrong"> ❌</span>
                    )}
                  </div>
                  <div className="quiz-modern-correct-answer">
                    Đáp án đúng:{" "}
                    <span>
                      {String.fromCharCode(65 + correctIdx)}.{" "}
                      {q.options[correctIdx].text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {wrongIndexes.length > 0 && !reviewWrong && (
            <button
              className="btn-warning"
              onClick={reviewWrongQuestions}
              style={{ marginRight: 8 }}
            >
              Ôn tập lại câu sai
            </button>
          )}
          <button
            className="btn-primary"
            onClick={restartQuiz}
            style={{ marginRight: 8 }}
          >
            Làm lại bài thi
          </button>
          <button
            className="btn-secondary"
            onClick={() => setSelectedQuiz(null)}
          >
            Quay lại danh sách
          </button>
        </div>
        <style>{quizModernStyle}</style>
      </div>
    );
  }

  // Đang làm bài
  const q = questions[current];
  return (
    <div className="quiz-modern-container">
      <div className="quiz-modern-card card">
        <div className="quiz-modern-progress">
          <div
            className="quiz-modern-progress-bar"
            style={{ width: `${progress}%` }}
          />
          <span className="quiz-modern-progress-label">
            Câu {current + 1} / {questions.length}
          </span>
        </div>
        <div className="quiz-modern-question">{q.questionText}</div>
        <div className="quiz-modern-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`quiz-modern-option-btn${
                answers[current] === idx ? " selected" : ""
              }`}
              onClick={() => handleAnswer(idx)}
              type="button"
            >
              {String.fromCharCode(65 + idx)}. {opt.text}
            </button>
          ))}
        </div>
        <div className="quiz-modern-actions">
          {current > 0 && (
            <button
              onClick={() => setCurrent(current - 1)}
              className="btn-secondary"
            >
              Quay lại
            </button>
          )}
          {current < questions.length - 1 && (
            <button
              onClick={() => setCurrent(current + 1)}
              className="btn-primary"
            >
              Tiếp
            </button>
          )}
          {current === questions.length - 1 && (
            <button onClick={submitQuiz} className="btn-success">
              Nộp bài
            </button>
          )}
        </div>
      </div>
      <style>{quizModernStyle}</style>
    </div>
  );
}

// CSS-in-JS cho giao diện Quiz hiện đại
const quizModernStyle = `
.quiz-modern-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.quiz-modern-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.quiz-modern-header h2 {
  color: var(--primary);
  font-size: 1.7rem;
  font-weight: 800;
}
.quiz-modern-search {
  flex: 1 1 200px;
  max-width: 260px;
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 8px 12px;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text);
}
.quiz-modern-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.quiz-modern-card {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 1px 8px #0001;
  padding: 32px 18px 24px 18px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 180px;
  margin-bottom: 0;
}
.quiz-modern-card-title {
  color: var(--primary);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.quiz-modern-card-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 18px;
}
.quiz-modern-progress {
  height: 10px;
  background: var(--gray);
  border-radius: 6px;
  margin-bottom: 18px;
  position: relative;
  overflow: hidden;
}
.quiz-modern-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #1976d2 60%, #90caf9 100%);
  border-radius: 6px;
  transition: width 0.3s;
}
.quiz-modern-progress-label {
  position: absolute;
  right: 12px;
  top: -28px;
  font-size: 1rem;
  color: var(--primary);
  font-weight: 600;
}
.quiz-modern-question {
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: var(--text);
}
.quiz-modern-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}
.quiz-modern-option-btn {
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1.08rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text);
  font-weight: 500;
}
.quiz-modern-option-btn.selected,
.quiz-modern-option-btn:hover {
  background: #e3eaf2;
  border-color: var(--primary);
  color: var(--primary);
}
.quiz-modern-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.quiz-modern-result-list {
  margin: 24px 0 18px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.quiz-modern-result-item {
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: 0 1px 4px #0001;
  padding: 18px 12px;
  border-left: 6px solid #e3eaf2;
}
.quiz-modern-result-item.correct {
  border-left: 6px solid var(--success);
}
.quiz-modern-result-item.wrong {
  border-left: 6px solid var(--danger);
}
.quiz-modern-correct {
  color: var(--success);
  font-weight: 700;
}
.quiz-modern-wrong {
  color: var(--danger);
  font-weight: 700;
}
@media (max-width: 700px) {
  .quiz-modern-container {
    padding: 8px 0;
  }
  .quiz-modern-card {
    padding: 16px 4px 12px 4px;
  }
  .quiz-modern-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
`;
