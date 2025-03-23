const API_URL = "https://mon-app.onrender.com/upload"; // Remplace avec ton URL réelle

document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file");
    const analyzeBtn = document.getElementById("analyze-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const resultDiv = document.getElementById("result");

    fileInput.addEventListener("change", function () {
        analyzeBtn.disabled = !fileInput.files.length;
    });

    analyzeBtn.addEventListener("click", function () {
        if (!fileInput.files.length) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing...";

        fetch(API_URL, {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze Image";

            if (data.error) {
                resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <h2>Analysis Result</h2>
                    <img src="${data.processed_image}" alt="Processed Image">
                    <h3>Severity: ${data.severity}%</h3>
                    <p>${data.description}</p>
                `;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze Image";
            resultDiv.innerHTML = `<p class="error">An error occurred. Please try again.</p>`;
        });
    });

    refreshBtn.addEventListener("click", function () {
        fileInput.value = "";
        analyzeBtn.disabled = true;
        resultDiv.innerHTML = "";
    });
});
