import { Bar } from "react-chartjs-2";

export default function ProgressChart() {
  const quizScore = JSON.parse(localStorage.getItem("quizScore")) || 0;

  const data = {
    labels: ["Wellness Quiz"],
    datasets: [
      {
        label: "Score",
        data: [quizScore],
        backgroundColor: "#8acb76"
      }
    ]
  };

  return (
    <div className="card">
      <h2>My Progress 📊</h2>
      <Bar data={data} />
    </div>
  );
}
