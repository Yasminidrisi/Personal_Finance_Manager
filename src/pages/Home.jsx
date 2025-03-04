import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { addTransaction, getTransactions } from "../../utils/ApiRequest";
// import Header from "../../components/Header";
// import TableData from "./TableData";
// import Analytics from "./Analytics";
// import Spinner from "../../components/Spinner";
// import { toast, ToastContainer } from "react-toastify";
// import { Button, Modal, Form } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import "react-toastify/dist/ReactToastify.css";
// import "react-datepicker/dist/react-datepicker.css";
// import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({ frequency: "7", type: "all", startDate: null, endDate: null });
  const [values, setValues] = useState({ title: "", amount: "", description: "", category: "", date: "", transactionType: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");
    if (!user.isAvatarImageSet) return navigate("/setAvatar");
    setcUser(user);
    setRefresh(true);
  }, [navigate]);

  useEffect(() => {
    if (!cUser) return;
    setLoading(true);
    axios.post(getTransactions, { userId: cUser._id, ...filters }).then(({ data }) => {
      setTransactions(data.transactions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [refresh, filters, cUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(values).some((v) => !v)) return toast.error("Fill all fields");
    setLoading(true);
    const { data } = await axios.post(addTransaction, { ...values, userId: cUser._id });
    data.success ? toast.success(data.message) : toast.error(data.message);
    setLoading(false);
    setShow(false);
    setRefresh(!refresh);
  };

  return (
    <>
      <Header />
      {loading ? <Spinner /> : (
        <div className="p-4 bg-black min-h-screen">
          <div className="flex gap-4 mb-4 text-white">
            <select value={filters.frequency} onChange={(e) => setFilters({ ...filters, frequency: e.target.value })} className="p-2 bg-gray-800 rounded">
              <option value="7">Last Week</option>
              <option value="30">Last Month</option>
              <option value="365">Last Year</option>
              <option value="custom">Custom</option>
            </select>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="p-2 bg-gray-800 rounded">
              <option value="all">All</option>
              <option value="expense">Expense</option>
              <option value="credit">Income</option>
            </select>
            <FormatListBulletedIcon className={view === "table" ? "text-blue-500" : "text-gray-400"} onClick={() => setView("table")} />
            <BarChartIcon className={view === "chart" ? "text-blue-500" : "text-gray-400"} onClick={() => setView("chart")} />
            <Button onClick={() => setShow(true)}>Add</Button>
          </div>
          {filters.frequency === "custom" && (
            <div className="flex gap-4 text-white">
              <DatePicker selected={filters.startDate} onChange={(date) => setFilters({ ...filters, startDate: date })} className="p-2 bg-gray-800 rounded" />
              <DatePicker selected={filters.endDate} onChange={(date) => setFilters({ ...filters, endDate: date })} className="p-2 bg-gray-800 rounded" />
            </div>
          )}
          {view === "table" ? <TableData data={transactions} user={cUser} /> : <Analytics transactions={transactions} user={cUser} />}
          <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header closeButton><Modal.Title>Add Transaction</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form>
                {["title", "amount", "description", "category", "transactionType", "date"].map((field) => (
                  <Form.Group key={field} className="mb-3">
                    <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                    <Form.Control name={field} value={values[field]} onChange={(e) => setValues({ ...values, [field]: e.target.value })} />
                  </Form.Group>
                ))}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
              <Button variant="primary" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
          </Modal>
          <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
        </div>
      )}
    </>
  );
};

export default Home;
