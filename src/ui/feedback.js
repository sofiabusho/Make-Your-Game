/**
 * Bundles UI feedback helpers for scores, combos, notifications, and Game Over.
 */

export function createFeedbackSystem({
    entitiesLayer,
    comboDisplay,
    centerNotification,
    gameoverOverlay,
    finalScore,
    finalAccuracy,
    finalCombo,
    finalLevel,
    finalCaught,
    celebrateHighScore,
    updateHighScoreListUI,
    addHighScore,
    isHighScore,
    state,
    storyManager,
}) {
    function showScorePopup(x, y, points, comboCount) {
        if (!entitiesLayer) return;
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        const comboText = comboCount > 1 ? ` (${comboCount}x)` : '';
        popup.textContent = `+${points}${comboText}`;
        // Position popup at click location, centered
        popup.style.position = 'absolute';
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.pointerEvents = 'none';
        popup.style.zIndex = '1000';
        entitiesLayer.appendChild(popup);
        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 1000);
    }

    function updateComboDisplay() {
        if (!comboDisplay) return;
        if (state.getCombo() >= 2) {
            comboDisplay.textContent = `${state.getCombo()}x COMBO!`;
            comboDisplay.classList.add('active');
        } else {
            comboDisplay.classList.remove('active');
        }
    }

    function showCenterNotification(message, type = '', duration = 2000) {
        if (!centerNotification) return;

        centerNotification.textContent = message;
        // Preserve existing classes (positioning/animation), just toggle visibility and type
        if (type) {
            centerNotification.classList.remove('life-lost', 'level-up');
            centerNotification.classList.add(type);
        }
        centerNotification.classList.add('show');

        setTimeout(() => {
            centerNotification.classList.remove('show');
        }, duration);
    }

    function showGameOver() {
        state.setRunning(false);
        state.setPaused(true);

        // Determine if it's a victory (completed all levels or achieved high score)
        const isVictory = state.getLevel() >= 10 || state.getScore() >= 5000;

        // Show conclusion story before game over screen
        if (storyManager) {
            storyManager.showConclusion(isVictory, () => {
                // After conclusion story, show game over screen
                showCenterNotification('GAME OVER', 'life-lost', 1500);
                if (!gameoverOverlay) return;

                const totalShots = state.getTotalShots();
                const totalHits = state.getTotalHits();
                const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

                if (finalScore) finalScore.textContent = String(state.getScore());
                
                const currentScore = state.getScore();
                const qualifiesForHighScore = isHighScore && isHighScore(currentScore);
                
                if (currentScore > state.getHighScore()) {
                    state.setHighScore(currentScore);
                    showCenterNotification('🏆 NEW HIGH SCORE!', 'level-up', 2500);
                    celebrateHighScore();
                }

                if (finalAccuracy) finalAccuracy.textContent = `${accuracy}%`;
                if (finalCombo) finalCombo.textContent = `${state.getMaxCombo()}x`;
                if (finalLevel) finalLevel.textContent = String(state.getLevel());
                if (finalCaught) finalCaught.textContent = String(state.getFishCaught());

                setTimeout(() => {
                    gameoverOverlay.classList.remove('hidden');
                    
                    // Show name input if score qualifies for top 5
                    const nameInputContainer = document.getElementById('high-score-input-container');
                    const playerInitialsInput = document.getElementById('player-initials');
                    const submitInitialsBtn = document.getElementById('submit-initials-btn');
                    
                    if (qualifiesForHighScore && nameInputContainer && playerInitialsInput) {
                        nameInputContainer.classList.remove('hidden');
                        playerInitialsInput.value = '';
                        playerInitialsInput.focus();
                        
                        // Only allow letters in input
                        const handleInput = (e) => {
                            e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
                        };
                        playerInitialsInput.addEventListener('input', handleInput);
                        
                        // Handle submit button
                        const handleSubmit = () => {
                            const initials = playerInitialsInput.value.trim().toUpperCase().slice(0, 3) || '---';
                            addHighScore(currentScore, initials);
                            updateHighScoreListUI();
                            nameInputContainer.classList.add('hidden');
                            submitInitialsBtn.removeEventListener('click', handleSubmit);
                            playerInitialsInput.removeEventListener('keypress', handleKeyPress);
                            playerInitialsInput.removeEventListener('input', handleInput);
                        };
                        
                        const handleKeyPress = (e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        };
                        
                        submitInitialsBtn.addEventListener('click', handleSubmit);
                        playerInitialsInput.addEventListener('keypress', handleKeyPress);
                    } else if (nameInputContainer) {
                        nameInputContainer.classList.add('hidden');
                    }
                }, 1600);

                updateHighScoreListUI();
            });
        } else {
            // Fallback if story manager not available
            showCenterNotification('GAME OVER', 'life-lost', 1500);
            if (!gameoverOverlay) return;

            const totalShots = state.getTotalShots();
            const totalHits = state.getTotalHits();
            const accuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 100) : 0;

            if (finalScore) finalScore.textContent = String(state.getScore());
            
            const currentScore = state.getScore();
            const qualifiesForHighScore = isHighScore && isHighScore(currentScore);
            
            if (currentScore > state.getHighScore()) {
                state.setHighScore(currentScore);
                showCenterNotification('🏆 NEW HIGH SCORE!', 'level-up', 2500);
                celebrateHighScore();
            }

            if (finalAccuracy) finalAccuracy.textContent = `${accuracy}%`;
            if (finalCombo) finalCombo.textContent = `${state.getMaxCombo()}x`;
            if (finalLevel) finalLevel.textContent = String(state.getLevel());
            if (finalCaught) finalCaught.textContent = String(state.getFishCaught());

            setTimeout(() => {
                gameoverOverlay.classList.remove('hidden');
                
                // Show name input if score qualifies for top 5
                const nameInputContainer = document.getElementById('high-score-input-container');
                const playerInitialsInput = document.getElementById('player-initials');
                const submitInitialsBtn = document.getElementById('submit-initials-btn');
                
                if (qualifiesForHighScore && nameInputContainer && playerInitialsInput) {
                    nameInputContainer.classList.remove('hidden');
                    playerInitialsInput.value = '';
                    playerInitialsInput.focus();
                    
                    // Only allow letters in input
                    const handleInput = (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
                    };
                    playerInitialsInput.addEventListener('input', handleInput);
                    
                    // Handle submit button
                    const handleSubmit = () => {
                        const initials = playerInitialsInput.value.trim().toUpperCase().slice(0, 3) || '---';
                        addHighScore(currentScore, initials);
                        updateHighScoreListUI();
                        nameInputContainer.classList.add('hidden');
                        submitInitialsBtn.removeEventListener('click', handleSubmit);
                        playerInitialsInput.removeEventListener('keypress', handleKeyPress);
                        playerInitialsInput.removeEventListener('input', handleInput);
                    };
                    
                    const handleKeyPress = (e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    };
                    
                    submitInitialsBtn.addEventListener('click', handleSubmit);
                    playerInitialsInput.addEventListener('keypress', handleKeyPress);
                } else if (nameInputContainer) {
                    nameInputContainer.classList.add('hidden');
                }
            }, 1600);

            updateHighScoreListUI();
        }
    }

    function hideGameOver() {
        if (gameoverOverlay) gameoverOverlay.classList.add('hidden');
    }

    return {
        showScorePopup,
        updateComboDisplay,
        showCenterNotification,
        showGameOver,
        hideGameOver,
    };
}
