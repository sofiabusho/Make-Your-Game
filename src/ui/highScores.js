/**
 * Persists and renders high score data within localStorage-backed menus.
 */

export function loadHighScores() {
    try {
        const stored = localStorage.getItem('highScores');
        if (stored) return JSON.parse(stored);
    } catch (_) {
        // no-op: localStorage access failed
    }
    return [];
}

export function saveHighScores(scores) {
    try {
        localStorage.setItem('highScores', JSON.stringify(scores));
    } catch (_) {
        // no-op: localStorage access failed
    }
}

export function addHighScore(newScore, initials = '---') {
    const scores = loadHighScores();
    scores.push({ score: newScore, initials: initials.toUpperCase().slice(0, 3), date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 5);
    saveHighScores(topScores);
    return topScores;
}

export function isHighScore(score) {
    const scores = loadHighScores();
    // If less than 5 scores, always qualifies
    if (scores.length < 5) return true;
    // Check if score is higher than the lowest top 5 score
    const lowestTopScore = scores.length > 0 ? scores[scores.length - 1].score : 0;
    return score > lowestTopScore;
}

export function updateHighScoreListUI() {
    const listEl = document.getElementById('high-score-list');
    if (!listEl) return;

    const scores = loadHighScores();
    listEl.innerHTML = '';

    if (scores.length === 0) {
        const li = document.createElement('li');
        li.className = 'arcade-score-item text-cyan-300 text-center';
        li.textContent = 'No scores yet';
        listEl.appendChild(li);
        return;
    }

    scores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'arcade-score-item';
        // Format score with leading zeros to 6 digits (arcade style)
        const formattedScore = String(entry.score).padStart(6, '0');
        // Get initials from date or use placeholder (3 characters)
        const initials = entry.initials || '---';
        li.innerHTML = `
            <span class="score-rank">${index + 1}.</span>
            <span class="score-value">${formattedScore}</span>
            <span class="score-initials">${initials}</span>
        `;
        listEl.appendChild(li);
    });
}
