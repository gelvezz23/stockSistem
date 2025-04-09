import Menu from "./Menu";
import styles from "./Dashboard.module.css";
import { Outlet } from "react-router";
const Dashboard = () => {
  const { container, content } = styles;
  return (
    <div className={container}>
      <Menu />

      <div className={content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
