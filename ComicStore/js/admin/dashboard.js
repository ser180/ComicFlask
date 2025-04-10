import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sales chart
  const salesChartCanvas = document.getElementById("salesChart")

  if (salesChartCanvas) {
    const ctx = salesChartCanvas.getContext("2d")

    // Sample data
    const salesData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Sales",
          data: [1200, 1900, 1500, 2500, 1800, 3000, 2100],
          backgroundColor: "rgba(98, 0, 234, 0.2)",
          borderColor: "#6200ea",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: "#6200ea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    }

    const salesChart = new Chart(ctx, {
      type: "line",
      data: salesData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#333",
            titleColor: "#fff",
            bodyColor: "#fff",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (context) => `$${context.parsed.y}`,
            },
          },
        },
      },
    })
  }

  // Example of showing a toast notification
  // Uncomment to test
  // window.showToast('Welcome', 'Welcome to the Comic Store Admin Dashboard', 'info');
})

