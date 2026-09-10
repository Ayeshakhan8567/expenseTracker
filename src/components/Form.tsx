import { useState } from "react";
import { useEffect } from "react";

type Inputs = {
  title: string;
  amount: string;
  date: string;
  type: string;
  category: string;
};

const Form = () => {
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    amount: "",
    date: "",
    type: "",
    category: "",
  });

  const [list, setList] = useState<Inputs[]>(()=>{
    const storedList = localStorage.getItem("tasks");
    return storedList ? JSON.parse(storedList) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setList((prevList) => [...prevList, inputs]);

    setInputs({
      title: "",
      amount: "",
      date: "",
      type: "",
      category: "",
    });
  };

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

  return (
    <form  className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

      <label>Type</label>
      <select
        name="type"
        value={inputs.type}
        onChange={handleChange}
      >
        <option value="">Select type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

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

      <button type="submit">Add Expense</button>
    </form>
  );
};

export default Form;