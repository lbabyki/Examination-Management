import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (err) {
      setError("Không thể tải danh sách người dùng.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      fetchUsers();
    } catch (err) {
      setError("Không thể cập nhật vai trò.");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    try {
      // Lưu thông tin admin hiện tại
      // const currentAdmin = auth.currentUser;
      // Tạo user mới trên Firebase Auth (sẽ tự động đăng nhập user mới)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword
      );
      const user = userCredential.user;
      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName || "",
        role: newRole,
      });
      setCreateSuccess(
        "Tạo tài khoản thành công! Đang đăng nhập lại tài khoản admin..."
      );
      setShowAdminLogin(true);
      fetchUsers();
    } catch (err) {
      setCreateError(err.message);
    }
  };

  // Đăng nhập lại admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setCreateError("");
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      setCreateSuccess("Đã đăng nhập lại tài khoản admin!");
      setNewEmail("");
      setNewPassword("");
      setNewRole("user");
      setAdminEmail("");
      setAdminPassword("");
      setShowAdminLogin(false);
      fetchUsers();
    } catch (err) {
      setCreateError(
        "Tạo tài khoản thành công, nhưng đăng nhập lại admin thất bại: " +
          err.message
      );
    }
  };

  return (
    <div className="admin-modern-container">
      <div className="admin-modern-header">
        <h2>👤 Quản trị người dùng</h2>
      </div>
      {/* Form tạo tài khoản mới */}
      <form onSubmit={handleCreateUser} className="admin-modern-form card">
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
          className="admin-modern-input"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="admin-modern-input"
        />
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="admin-modern-input"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" className="btn-primary">
          Tạo tài khoản
        </button>
      </form>
      {showAdminLogin && (
        <form onSubmit={handleAdminLogin} className="admin-modern-form card">
          <input
            type="email"
            placeholder="Email admin"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            className="admin-modern-input"
          />
          <input
            type="password"
            placeholder="Mật khẩu admin"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
            className="admin-modern-input"
          />
          <button type="submit" className="btn-primary">
            Đăng nhập lại admin
          </button>
        </form>
      )}
      {createError && <p className="admin-modern-error">{createError}</p>}
      {createSuccess && <p className="admin-modern-success">{createSuccess}</p>}
      {error && <p className="admin-modern-error">{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="admin-modern-list card">
          <table className="admin-modern-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Thay đổi vai trò</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="admin-modern-input"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{adminModernStyle}</style>
    </div>
  );
}

const adminModernStyle = `
.admin-modern-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.admin-modern-header h2 {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}
.admin-modern-form {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 1px 8px #0001;
  padding: 24px 18px 18px 18px;
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.admin-modern-input {
  border-radius: 8px;
  border: 1px solid var(--border);
  padding: 8px 12px;
  font-size: 1rem;
  background: var(--card-bg);
  color: var(--text);
}
.admin-modern-list {
  background: var(--card-bg);
  border-radius: 14px;
  box-shadow: 0 1px 8px #0001;
  padding: 18px 10px 10px 10px;
  margin-bottom: 0;
}
.admin-modern-table {
  width: 100%;
  border-collapse: collapse;
}
.admin-modern-table th, .admin-modern-table td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}
.admin-modern-table th {
  background: var(--gray);
  color: var(--primary);
  font-weight: 700;
  font-size: 1.05rem;
}
.admin-modern-table tr:last-child td {
  border-bottom: none;
}
.admin-modern-error {
  color: var(--danger);
  margin-bottom: 8px;
}
.admin-modern-success {
  color: var(--success);
  margin-bottom: 8px;
}
@media (max-width: 800px) {
  .admin-modern-container {
    padding: 8px 0;
  }
  .admin-modern-form, .admin-modern-list {
    padding: 10px 2px 8px 2px;
  }
  .admin-modern-table th, .admin-modern-table td {
    padding: 6px 2px;
  }
}
`;
