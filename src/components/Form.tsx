import { useState } from "react";
import { useEffect } from "react";

type Inputs = {
  title: string;
  amount: string;
  date: string;
  category: string;
  id: string;
};

const Form = () => {
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    amount: "",
    date: "",
    category: "",
    id: "",
  });

  const [showExpenses, setShowExpenses] = useState<boolean>(false);

  const [editId, setEditId] = useState<string | null>(null);

  const [income, setIncome] = useState<number | "">(() => {
    const storedIncome = localStorage.getItem("income");
    return storedIncome ? Number(storedIncome) : "";
  });

  const [list, setList] = useState<Inputs[]>(() => {
    const storedList = localStorage.getItem("tasks");
    return storedList ? JSON.parse(storedList) : [];
  });

  const totalExpense = list.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const expenseInfo = {
    food: list
      .filter((expense) => expense.category === "food")
      .reduce((total, expense) => total + Number(expense.amount), 0),

    transport: list
      .filter((expense) => expense.category === "transport")
      .reduce((total, expense) => total + Number(expense.amount), 0),

    shopping: list
      .filter((expense) => expense.category === "shopping")
      .reduce((total, expense) => total + Number(expense.amount), 0),

    bills: list
      .filter((expense) => expense.category === "bills")
      .reduce((total, expense) => total + Number(expense.amount), 0),

    education: list
      .filter((expense) => expense.category === "education")
      .reduce((total, expense) => total + Number(expense.amount), 0),
  };

  const balance =
    typeof income === "number" ? income - totalExpense : "";

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("income", JSON.stringify(income));
  }, [income]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleEdit = (expense: Inputs) => {
    setInputs({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      id: expense.id,
    });

    setEditId(expense.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editId) {
      setList((prevList) =>
        prevList.map((expense) =>
          expense.id === editId
            ? {
                ...inputs,
                id: editId,
                amount: String(Number(inputs.amount)),
              }
            : expense
        )
      );

      setEditId(null);
    } else {
      const newExpense = {
        ...inputs,
        id: crypto.randomUUID(),
        amount: String(Number(inputs.amount)),
      };

      setList((prevList) => [...prevList, newExpense]);
    }

    setInputs({
      title: "",
      amount: "",
      date: "",
      category: "",
      id: "",
    });
  };

  return (
    <>
      <label>Income</label>

      <input
        value={income}
        onChange={(e) =>
          setIncome(e.target.value === "" ? "" : Number(e.target.value))
        }
        type="number"
        placeholder="Income"
      />

      <h2>Total Expense: {totalExpense}</h2>

      <h2>Balance: {balance}</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>Title</label>

        <input
          name="title"
          value={inputs.title}
          onChange={handleChange}
          type="text"
          placeholder="Title"
        />

        <label>Amount</label>

        <input
          name="amount"
          value={inputs.amount}
          onChange={handleChange}
          type="number"
          placeholder="Amount"
        />

        <label>Date</label>

        <input
          name="date"
          value={inputs.date}
          onChange={handleChange}
          type="date"
        />

        <label>Category</label>

        <select
          name="category"
          value={inputs.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="education">Education</option>
        </select>

        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <button onClick={() => setShowExpenses(!showExpenses)}>
        {showExpenses ? "Hide expenses" : "Show expenses"}
      </button>

      {showExpenses && (
        <div>
          <h1>Expense Information</h1>

          <p>Food: {expenseInfo.food}</p>
          <p>Transport: {expenseInfo.transport}</p>
          <p>Shopping: {expenseInfo.shopping}</p>
          <p>Bills: {expenseInfo.bills}</p>
          <p>Education: {expenseInfo.education}</p>

          <ul>
            {list.map((expense) => (
              <li
                key={expense.id}
                className="border border-gray-300 p-4 mb-4 rounded-lg"
                onClick={() => handleEdit(expense)}
              >
                <h3>{expense.title}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Form;