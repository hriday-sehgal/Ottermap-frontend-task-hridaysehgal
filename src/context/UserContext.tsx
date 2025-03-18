import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  firstName: string;
  mobileNumber: string;
  setUserInfo: (firstName: string, mobileNumber: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const setUserInfo = (name: string, mobile: string) => {
    setFirstName(name);
    setMobileNumber(mobile);
  };

  return (
    <UserContext.Provider value={{ firstName, mobileNumber, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}