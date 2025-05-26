import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import useUserRole from "../hooks/useUserRole";

export default function Sidebar() {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = useUserRole();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkClass = (path) =>
    "sidebar-link" + (location.pathname === path ? " active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">📝</span>
        <span className="sidebar-title">Quiz Manager</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={linkClass("/")}>
          Trang chủ
        </Link>
        {user && (
          <>
            <Link to="/subjects" className={linkClass("/subjects")}>
              Môn học
            </Link>
            <Link to="/quiz" className={linkClass("/quiz")}>
              Thi thử
            </Link>
            <Link to="/create-quiz" className={linkClass("/create-quiz")}>
              Tạo bài thi
            </Link>
            {role === "admin" && (
              <>
                <Link to="/admin" className={linkClass("/admin")}>
                  Quản trị
                </Link>
                <Link to="/manage-all" className={linkClass("/manage-all")}>
                  Quản lý tất cả
                </Link>
              </>
            )}

            <div className="sidebar-user">
              <span className="sidebar-user-email">{user.email}</span>
              <button className="sidebar-logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className={linkClass("/login")}>
              Đăng nhập
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
