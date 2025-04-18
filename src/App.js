import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

function rollDice() {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
}

function isYahtzee(dice) {
  return new Set(dice).size === 1;
}

function simulateYahtzeeTrials(numTrials) {
  const results = [];
  for (let i = 0; i < numTrials; i++) {
    let tries = 0;
    while (true) {
      tries++;
      if (isYahtzee(rollDice())) {
        results.push(tries);
        break;
      }
    }
  }
  return results;
}

export default function YahtzeeSimulator() {
  const [trials, setTrials] = useState(100);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);

  const handleSimulate = () => {
    const num = parseInt(trials);
    if (isNaN(num) || num <= 0) return;
    const data = simulateYahtzeeTrials(num);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    setStats({ avg: avg.toFixed(2), min, max });
    setResults(data);
  };

  const chartData = {
    labels: results.map((_, i) => i + 1),
    datasets: [
      {
        label: "Rolls per Trial",
        data: results,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        pointRadius: 3,
        showLine: false,
        order: 1,
      },
      stats && {
        label: `Average: ${stats.avg}`,
        data: Array(results.length).fill(stats.avg),
        borderColor: "#ef4444",
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 2,
        order: 2,
      },
    ].filter(Boolean),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: "Trial" },
      },
      y: {
        title: { display: true, text: "Rolls to Yahtzee" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎲 Yahtzee Simulator</div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          value={trials}
          onChange={(e) => setTrials(e.target.value)}
          placeholder="Number of trials"
          style={{ padding: "0.5rem", fontSize: "1rem", width: "60%" }}
        />
        <button
          onClick={handleSimulate}
          style={{ padding: "0.5rem 1rem", fontSize: "1rem", marginLeft: "0.5rem" }}
        >
          Simulate
        </button>
      </div>
      {stats && (
        <div style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
          <p>Average rolls: <strong>{stats.avg}</strong></p>
          <p>Min rolls: <strong>{stats.min}</strong></p>
          <p>Max rolls: <strong>{stats.max}</strong></p>
        </div>
      )}
      {results.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      {results.length > 0 && (
        <div style={{ textAlign: "left", maxHeight: "300px", overflowY: "auto", margin: "0 auto", backgroundColor: "#f9f9f9", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Results:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {results.map((r, i) => (
              <li key={i}>Trial {i + 1}: {r} rolls</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
