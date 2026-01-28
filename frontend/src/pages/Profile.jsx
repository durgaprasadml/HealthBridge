import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getProfile(token).then((res) => {
      setUser(res.user);
    });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>Name: {user.name}</p>
      <p>Health UID: {user.healthUid}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
