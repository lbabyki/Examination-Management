import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import useUserRole from "../hooks/useUserRole";

export default function Navbar() {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const role = useUserRole();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav
      style={{ padding: 16, borderBottom: "1px solid #eee", marginBottom: 24 }}
    >
      <Link to="/" style={{ marginRight: 16, fontWeight: "bold" }}>
        Trang chủ
      </Link>
      {user ? (
        <>
          <Link to="/subjects" style={{ marginRight: 16 }}>
            Môn học
          </Link>
          <Link to="/create-quiz" style={{ marginRight: 16 }}>
            Tạo bài thi
          </Link>
          <Link to="/quiz" style={{ marginRight: 16 }}>
            Thi thử
          </Link>
          {role === "admin" && (
            <>
              <Link to="/admin" style={{ marginRight: 16, color: "red" }}>
                Quản trị
              </Link>
              <Link to="/manage-all" style={{ marginRight: 16 }}>
                Quản lý tất cả
              </Link>
            </>
          )}
          <span style={{ marginRight: 16 }}>Xin chào, {user.email}</span>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 16 }}>
            Đăng nhập
          </Link>
          {/* <Link to="/register">Đăng ký</Link> */}
        </>
      )}
    </nav>
  );
}
