import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-modern-container">
      <section className="home-hero-modern card">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            <span style={{ color: "var(--primary)" }}>Quiz Manager</span> <br />
            Nền tảng luyện tập & thi trắc nghiệm thông minh
          </h1>
          <p className="home-hero-slogan">
            Học tập chủ động, kiểm tra dễ dàng, quản lý hiệu quả.
            <br />
            Dành cho giáo viên & học sinh hiện đại.
          </p>
          <div className="home-hero-actions">
            <Link to="/quiz" className="btn-primary btn-lg">
              Thi thử ngay
            </Link>
            <Link to="/subjects" className="btn-primary btn-lg btn-outline">
              Quản lý môn học
            </Link>
          </div>
        </div>
        <div className="home-hero-illustration">
          <img
            src="https://haycafe.vn/wp-content/uploads/2022/06/anh-hoc-bai-hinh-ve-cute.jpg"
            alt="Quiz Illustration"
          />
        </div>
      </section>
      <section className="home-features-modern">
        <div className="home-feature-modern card">
          <div className="home-feature-icon">📚</div>
          <h3>Quản lý môn học & câu hỏi</h3>
          <p>
            Tạo, chỉnh sửa, tổ chức môn học và bộ câu hỏi trắc nghiệm theo từng
            chủ đề.
          </p>
        </div>
        <div className="home-feature-modern card">
          <div className="home-feature-icon">🧑‍💻</div>
          <h3>Làm bài thi thử</h3>
          <p>
            Làm bài thi với giao diện đẹp, chấm điểm tự động, xem lại đáp án
            đúng/sai, ôn tập lại các câu sai.
          </p>
        </div>
        <div className="home-feature-modern card">
          <div className="home-feature-icon">🔒</div>
          <h3>Bảo mật & phân quyền</h3>
          <p>
            Đăng nhập an toàn, phân quyền rõ ràng, dữ liệu cá nhân được bảo vệ
            tuyệt đối.
          </p>
        </div>
        <div className="home-feature-modern card">
          <div className="home-feature-icon">🚀</div>
          <h3>Trải nghiệm mượt mà</h3>
          <p>
            Giao diện tối giản, hiện đại, hỗ trợ nền tối, tối ưu cho cả máy tính
            và di động.
          </p>
        </div>
      </section>
      <style>{`
      .home-modern-container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 0 0 0;
        display: flex;
        flex-direction: column;
        gap: 48px;
      }
      .home-hero-modern {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(90deg, #e3eaf2 0%, #f7fafd 100%);
        border-radius: 20px;
        box-shadow: 0 2px 16px #0001;
        padding: 48px 32px 40px 32px;
        gap: 32px;
      }
      .home-hero-content {
        flex: 1 1 400px;
        min-width: 260px;
      }
      .home-hero-title {
        font-size: 2.7rem;
        font-weight: 900;
        margin-bottom: 18px;
        line-height: 1.2;
      }
      .home-hero-slogan {
        color: var(--text-secondary);
        font-size: 1.25rem;
        margin-bottom: 32px;
      }
      .home-hero-actions {
        display: flex;
        gap: 18px;
      }
      .btn-lg {
        font-size: 1.1rem;
        padding: 12px 28px;
      }
      .btn-outline {
        background: transparent;
        color: var(--primary);
        border: 2px solid var(--primary);
      }
      .btn-outline:hover {
        background: var(--primary);
        color: #fff;
        text-decoration: none;
      }
      .home-hero-illustration {
        flex: 1 1 320px;
        min-width: 220px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .home-hero-illustration img {
        max-width: 320px;
        width: 100%;
        border-radius: 16px;
        box-shadow: 0 2px 16px #0002;
        background: #fff;
      }
      .home-features-modern {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 24px;
      }
      .home-feature-modern {
        background: var(--card-bg);
        border-radius: 14px;
        box-shadow: 0 1px 8px #0001;
        padding: 32px 18px 24px 18px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 180px;
      }
      .home-feature-icon {
        font-size: 2.2rem;
        margin-bottom: 10px;
      }
      .home-feature-modern h3 {
        color: var(--primary);
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .home-feature-modern p {
        color: var(--text-secondary);
        font-size: 1rem;
      }
      @media (max-width: 900px) {
        .home-hero-modern {
          flex-direction: column-reverse;
          padding: 24px 8px 24px 8px;
        }
        .home-hero-illustration img {
          max-width: 220px;
        }
        .home-modern-container {
          padding: 12px 0 0 0;
        }
      }
      `}</style>
    </div>
  );
}
