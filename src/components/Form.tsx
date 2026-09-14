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
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Tracker
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your income and expenses
          </p>
        </div>

        {/* Income / Balance / Expense */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Income
            </label>

            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={income}
              onChange={(e) =>
                setIncome(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              type="number"
              placeholder="Income"
            />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Expense
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-500">
              {totalExpense}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Balance
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {balance}
            </h2>
          </div>
        </div>

        {/* Form */}
        <form
          className="mb-8 rounded-xl bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            {editId ? "Edit Expense" : "Add Expense"}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                name="title"
                value={inputs.title}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Gym"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Amount
              </label>

              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                name="amount"
                value={inputs.amount}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 1000"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Date
              </label>

              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                name="date"
                value={inputs.date}
                onChange={handleChange}
                type="date"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            type="submit"
          >
            {editId ? "Update Expense" : "Add Expense"}
          </button>
        </form>

        {/* Show Expenses Button */}
        <button
          className="mb-6 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          onClick={() => setShowExpenses(!showExpenses)}
        >
          {showExpenses ? "Hide expenses" : "Show expenses"}
        </button>

        {showExpenses && (
          <div className="rounded-xl bg-white p-6 shadow-sm">

            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              Expense Information
            </h1>

            {/* Category Information */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm text-gray-500">Food</p>
                <p className="mt-1 text-xl font-bold text-orange-600">
                  {expenseInfo.food}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-500">Transport</p>
                <p className="mt-1 text-xl font-bold text-blue-600">
                  {expenseInfo.transport}
                </p>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-500">Shopping</p>
                <p className="mt-1 text-xl font-bold text-purple-600">
                  {expenseInfo.shopping}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-500">Bills</p>
                <p className="mt-1 text-xl font-bold text-red-600">
                  {expenseInfo.bills}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-500">Education</p>
                <p className="mt-1 text-xl font-bold text-green-600">
                  {expenseInfo.education}
                </p>
              </div>

            </div>

            {/* Expense List */}
            <ul className="space-y-3">
              {list.map((expense) => (
                <li
                  key={expense.id}
                  className="cursor-pointer rounded-lg border border-gray-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                  onClick={() => handleEdit(expense)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {expense.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {expense.category} • {expense.date}
                      </p>
                    </div>

                    <p className="font-bold text-red-500">
                      {expense.amount}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

          </div>
        )}
      </div>
    </div>
  );
};

export default Form;