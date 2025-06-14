document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('repo-form');
    const urlInput = document.getElementById('repo-url');
    const analyzeButton = document.getElementById('analyze-button');
    const statusMessage = document.getElementById('status-message');
    const resultsContainer = document.getElementById('results-container');
    const chatbotLink = document.getElementById('chatbot-link');

    // URL COMPLETA del endpoint del analizador en tu backend
    const analyzerApiUrl = 'http://127.0.0.1:8000/analyzer/analyze';

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const repoUrl = urlInput.value;
        if (!repoUrl) return;

        // Iniciar estado de carga
        analyzeButton.disabled = true;
        analyzeButton.textContent = 'Analizando...';
        statusMessage.textContent = 'Clonando y analizando el repositorio. Esto puede tardar varios minutos...';
        resultsContainer.innerHTML = '';
        chatbotLink.style.display = 'none';

        try {
            const response = await fetch(analyzerApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repo_url: repoUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ocurrió un error en el servidor.');
            }

            const data = await response.json();
            statusMessage.textContent = '¡Análisis completado! Ya puedes hablar con el chatbot.';
            chatbotLink.style.display = 'block'; // Mostrar enlace al chatbot
            displayResults(data.results);

        } catch (error) {
            console.error('Error:', error);
            statusMessage.textContent = `Error: ${error.message}`;
        } finally {
            analyzeButton.disabled = false;
            analyzeButton.textContent = 'Analizar Repositorio';
        }
    });

    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<p>No se encontraron archivos válidos para analizar.</p>';
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const header = document.createElement('div');
            header.className = 'result-header';
            header.textContent = item.file_path.replace('repo_temporal/', '');

            const summary = document.createElement('div');
            summary.className = 'result-summary';
            summary.textContent = item.technical_summary;
            
            header.addEventListener('click', () => {
                summary.style.display = summary.style.display === 'block' ? 'none' : 'block';
            });

            resultItem.appendChild(header);
            resultItem.appendChild(summary);
            resultsContainer.appendChild(resultItem);
        });
    }
});