import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1 className="bg-red-50 text-2xl font-bold">BOJ Rooms</h1>
      <h2>{count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}>
        test
      </button>
    </>
  );
}
