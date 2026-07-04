import { createContext, useContext, useState, useEffect } from 'react';
import { mockData } from '../data/mockData';

export const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [realUser, setRealUser] = useState<any>(null);
  const [realRole, setRealRole] = useState<any>(null); // 'hod', 'coordinator', 'faculty', or 'student'
  const [loading, setLoading] = useState(true);

  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const [impersonatedRole, setImpersonatedRole] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('acronexus_user');
    const storedRole = localStorage.getItem('acronexus_role');
    
    if (storedUser && storedRole) {
      setRealUser(JSON.parse(storedUser));
      setRealRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (requestedRole, id) => {
    let selectedUser;
    let actualRole = requestedRole;

    if (requestedRole === 'hod' || requestedRole === 'coordinator' || requestedRole === 'faculty') {
      selectedUser = mockData.admins.find(a => a.id === id || a.empId === id || a.email === id);
      if (selectedUser) {
        actualRole = selectedUser.role || 'faculty';
      } else {
        selectedUser = mockData.admins[0];
        actualRole = selectedUser.role || 'hod';
      }
    } else {
      selectedUser = mockData.students.find(s => s.id === id || s.enrollmentNumber === id || s.email === id) || mockData.students[0];
      actualRole = 'student';
    }
    
    setRealUser(selectedUser);
    setRealRole(actualRole);
    localStorage.setItem('acronexus_user', JSON.stringify(selectedUser));
    localStorage.setItem('acronexus_role', actualRole);
    
    // Reset impersonation on login
    setImpersonatedUser(null);
    setImpersonatedRole(null);
    setIsEditMode(false);
  };

  const logout = () => {
    setRealUser(null);
    setRealRole(null);
    setImpersonatedUser(null);
    setImpersonatedRole(null);
    setIsEditMode(false);
    localStorage.removeItem('acronexus_user');
    localStorage.removeItem('acronexus_role');
  };

  const startImpersonation = (impUser, impRole) => {
    setImpersonatedUser(impUser);
    setImpersonatedRole(impRole);
    setIsEditMode(false); // Default to read-only
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
    setImpersonatedRole(null);
    setIsEditMode(false);
  };

  const user = impersonatedUser || realUser;
  const role = impersonatedRole || realRole;

  return (
    <AuthContext.Provider value={{ 
      user, role, realUser, realRole, 
      login, logout, loading,
      impersonatedUser, startImpersonation, stopImpersonation,
      isEditMode, setIsEditMode
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
