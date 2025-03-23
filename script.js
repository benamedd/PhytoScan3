const fileInput = document.getElementById("file");
const analyzeBtn = document.getElementById("analyze-btn");
const refreshBtn = document.getElementById("refresh-btn");
const resultDiv = document.getElementById("result");
let selectedFile = null;
const API_URL = "https://tonserveur.com/upload"; // Remplace par l'URL de ton backend

fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  analyzeBtn.disabled = !selectedFile;

  if (selectedFile) {
    // Vérification du type de fichier
    if (!selectedFile.type.startsWith("image/")) {
      resultDiv.innerHTML = "<p class='error'>Please select a valid image file.</p>";
      fileInput.value = "";
      selectedFile = null;
      analyzeBtn.disabled = true;
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    resultDiv.innerHTML = `
      <p><strong style="color: red;">Selected File:</strong> ${selectedFile.name}</p>
      <img src="${previewUrl}" alt="Preview" style="max-width: 200px;">
    `;
  } else {
    resultDiv.innerHTML = "";
  }
});

analyzeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!selectedFile) {
    resultDiv.innerHTML = "<p class='error'>Please select a file</p>";
    return;
  }

  if (!navigator.onLine) {
    resultDiv.innerHTML = "<p class='error'>No internet connection.</p>";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);
  resultDiv.innerHTML = "<p>Processing...</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        // Désactiver cette ligne si CORS bloque l'accès
        // "Content-Type": "multipart/form-data" 
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
    } else {
      const severityValue = data.severity ? data.severity.split(" ")[0] : "Not available";
      resultDiv.innerHTML = `<h2>Infection Severity: ${severityValue}</h2>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    console.error("Fetch error:", error);
  }
});

refreshBtn.addEventListener("click", () => {
  fileInput.value = "";
  selectedFile = null;
  analyzeBtn.disabled = true;
  resultDiv.innerHTML = "";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
