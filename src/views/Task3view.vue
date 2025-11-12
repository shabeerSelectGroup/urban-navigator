
<template>
  <div class="task-container">
    <div class="header-section">
      <h1>Sharjah – Al Noor Mosque / Art Museum</h1>
      <h2>QR Match of Meaning</h2>
      <div class="score-container">
        <div class="score">Score: {{ score }}</div>
        <div class="lives">Lives: ❤️ ❤️ ❤️</div>
      </div>
      <p class="challenge-instruction">Match the icons with their corresponding meanings by dragging and dropping.</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    
    <div class="matching-game">
      <!-- Left Column - Icons -->
      <div class="column">
        <h3>Icons</h3>
        <div 
          v-for="(item, index) in items" 
          :key="'item-' + index"
          class="draggable-item"
          draggable="true"
          @dragstart="onDragStart($event, index, 'item')"
          @dragend="onDragEnd"
          :class="{ 'matched': item.matched }"
        >
          {{ item.name }}
        </div>
      </div>
      
      <!-- Right Column - Meanings -->
      <div class="column">
        <h3>Meanings</h3>
        <div 
          v-for="(meaning, index) in meanings" 
          :key="'meaning-' + index"
          class="drop-zone"
          @dragover.prevent
          @drop="onDrop($event, index, 'meaning')"
          :class="{ 'matched': meaning.matched }"
        >
          {{ meaning.text }}
          <div v-if="meaning.matchedItemIndex !== null" class="matched-item">
            {{ items[meaning.matchedItemIndex].name }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="allMatched" class="success-message">
      <h3>🎉 Level Complete! 🎉</h3>
      <p>Perfect! You've matched all items correctly!</p>
      <p>Your final score: <strong>{{ score }} points</strong></p>
      <button @click="resetGame" class="play-again-btn">Play Again</button>
    </div>
    
    <div v-if="gameOver" class="game-over">
      <h3>Game Over</h3>
      <p>You've run out of lives!</p>
      <button @click="resetGame" class="play-again-btn">Try Again</button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

export default {
  name: 'Task3View',
  data() {
    return {
      items: [
        { id: 0, name: '1. Calligraphy panel', matched: false, icon: '🖌️' },
        { id: 1, name: '2. Al Noor Mosque', matched: false, icon: '🕌' },
        { id: 2, name: '3. Dhow painting', matched: false, icon: '⛵' },
        { id: 3, name: '4. Falcon sculpture', matched: false, icon: '🦅' },
        { id: 4, name: '5. Sand dune photograph', matched: false, icon: '🏜️' }
      ],
      meanings: [
        { id: 0, text: 'A. Tribute to UAE\'s maritime roots and trade heritage', matched: false, matchedItemIndex: null },
        { id: 1, text: 'B. Connection between nature and human endurance', matched: false, matchedItemIndex: null },
        { id: 2, text: 'C. Expression of divine beauty through Arabic script', matched: false, matchedItemIndex: null },
        { id: 3, text: 'D. Symbol of light, learning, and spiritual openness', matched: false, matchedItemIndex: null },
        { id: 4, text: 'E. National pride, strength, and freedom', matched: false, matchedItemIndex: null }
      ],
      correctMatches: {
        0: 2, // Calligraphy panel -> C
        1: 3, // Al Noor Mosque -> D
        2: 0, // Dhow painting -> A
        3: 4, // Falcon sculpture -> E
        4: 1  // Sand dune photograph -> B
      },
      draggedItem: null,
      draggedItemType: null,
      score: 0,
      lives: 3,
      gameOver: false,
      progress: 0
    }
  },
  computed: {
    allMatched() {
      const allMatched = this.items.every(item => item.matched);
      if (allMatched) {
        this.celebrate();
      }
      return allMatched;
    },
    livesDisplay() {
      return '❤️'.repeat(this.lives) + '♡'.repeat(3 - this.lives);
    }
  },
  methods: {
    celebrate() {
      // Launch confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Show celebration message
      Swal.fire({
        title: 'Amazing!',
        text: 'You\'ve completed all matches!',
        icon: 'success',
        confirmButtonText: 'Play Again',
        background: '#f8f9fa',
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat-nyan.gif")
          left top
          no-repeat
        `
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetGame();
        }
      });
    },
    
    showFeedback(type) {
      const feedback = document.createElement('div');
      feedback.className = `feedback ${type}`;
      feedback.textContent = type === 'correct' ? '+100' : '-1 Life';
      document.body.appendChild(feedback);
      
      // Position near the cursor or center
      feedback.style.left = (event.pageX - 30) + 'px';
      feedback.style.top = (event.pageY - 30) + 'px';
      
      // Animate
      setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-50px)';
        setTimeout(() => feedback.remove(), 500);
      }, 100);
    },
    
    showGameOver() {
      Swal.fire({
        title: 'Game Over!',
        text: `Your final score: ${this.score}`,
        icon: 'error',
        confirmButtonText: 'Try Again',
        showCancelButton: true,
        cancelButtonText: 'Quit',
        background: '#f8f9fa',
        backdrop: `
          rgba(255,0,0,0.4)
          center left
          no-repeat
        `
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetGame();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Optional: Handle quit action
        }
      });
    },
    
    updateProgress() {
      const matchedCount = this.items.filter(item => item.matched).length;
      this.progress = (matchedCount / this.items.length) * 100;
    },
    
    resetGame() {
      this.items = this.items.map(item => ({ ...item, matched: false, dragging: false }));
      this.meanings = this.meanings.map(meaning => ({
        ...meaning,
        matched: false,
        matchedItemIndex: null,
        incorrect: false
      }));
      this.score = 0;
      this.lives = 3;
      this.gameOver = false;
      this.progress = 0;
    },
    
    onDragStart(event, index, type) {
      if (this.items[index].matched) {
        event.preventDefault();
        return;
      }
      this.draggedItem = index;
      this.draggedItemType = type;
      event.dataTransfer.effectAllowed = 'move';
      
      // Add visual feedback
      event.target.classList.add('dragging');
    },
    
    onDragEnd(event) {
      this.draggedItem = null;
      this.draggedItemType = null;
      document.querySelectorAll('.dragging').forEach(el => {
        el.classList.remove('dragging');
      });
    },
    
    onDrop(event, dropIndex, dropType) {
      if (this.draggedItemType === 'item' && dropType === 'meaning' && !this.gameOver) {
        const itemIndex = this.draggedItem;
        const meaningIndex = dropIndex;
        
        // Check if this is the correct match
        if (this.correctMatches[itemIndex] === meaningIndex) {
          // Mark both as matched
          this.items[itemIndex].matched = true;
          this.meanings[meaningIndex].matched = true;
          this.meanings[meaningIndex].matchedItemIndex = itemIndex;
          
          // Update score and progress
          this.score += 100;
          this.updateProgress();
          
          // Show success feedback
          this.showFeedback('correct');
          
          // Disable dragging for matched items
          const draggableItem = event.target.closest('.draggable-item');
          if (draggableItem) {
            draggableItem.draggable = false;
          }
          
          // Play success sound
          this.playSound('success');
        } else {
          // Decrease lives for incorrect match
          this.lives--;
          this.showFeedback('incorrect');
          
          // Play error sound
          this.playSound('error');
          
          // Check if game over
          if (this.lives <= 0) {
            this.gameOver = true;
            this.showGameOver();
          }
          
          // Visual feedback for incorrect match
          const dropZone = event.target.closest('.drop-zone');
          if (dropZone) {
            dropZone.classList.add('incorrect');
            setTimeout(() => {
              dropZone.classList.remove('incorrect');
            }, 1000);
          }
        }
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.feedback {
  position: fixed;
  font-size: 1.5em;
  font-weight: bold;
  pointer-events: none;
  z-index: 1000;
  animation: float 1s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(0,0,0,0.3);
}

.feedback.correct {
  color: #2ecc71;
}

.feedback.incorrect {
  color: #e74c3c;
}
.task-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.task-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, #3498db, #9b59b6, #e74c3c, #f1c40f, #2ecc71);
}

.header-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.2em;
  font-weight: 700;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0;
}

h2 {
  color: #7f8c8d;
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 1.5em;
}

.challenge-instruction {
  text-align: center;
  color: #555;
  margin: 20px 0 30px;
  font-size: 1.1em;
  line-height: 1.6;
}

.score-container {
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin: 0 auto 20px;
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
}

.score, .lives {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 5px;
}

.score {
  color: #3498db;
}

.lives {
  color: #e74c3c;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #ecf0f1;
  border-radius: 5px;
  margin: 20px 0 0;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db);
  width: 0%;
  transition: width 0.5s ease;
  border-radius: 5px;
}

.matching-game {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  margin: 40px 0;
  position: relative;
  min-height: 400px;
}

.column {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.column::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #3498db, #9b59b6);
}

.column:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

h3 {
  color: #2c3e50;
  border-bottom: 2px solid #e0e6ed;
  padding-bottom: 12px;
  margin: 0 0 20px 0;
  font-size: 1.4em;
  position: relative;
}

h3::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: #3498db;
}

.draggable-item, .drop-zone {
  background-color: white;
  border: 2px dashed #e0e6ed;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  cursor: move;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  font-size: 0.95em;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 10px;
}

.draggable-item::before {
  content: '≡';
  color: #bdc3c7;
  font-size: 1.2em;
  margin-right: 5px;
}

.draggable-item:hover {
  background-color: #f8faff;
  border-color: #3498db;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.draggable-item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.drop-zone {
  min-height: 70px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.drop-zone.over {
  background-color: #e3f2fd;
  border-color: #3498db;
  transform: scale(1.02);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
}

.matched {
  background-color: #e8f7e8 !important;
  border-color: #2ecc71 !important;
  color: #27ae60;
  border-style: solid !important;
  padding-right: 45px;
  position: relative;
  animation: pulse 1s ease-in-out;
}

.matched::after {
  content: '✓';
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  background: #2ecc71;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
}

.incorrect {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  border-color: #e74c3c !important;
  background-color: #ffebee !important;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.matched-item {
  margin-top: 10px;
  padding: 10px 15px;
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  border-radius: 6px;
  color: #155724;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.matched-item::before {
  content: '✓';
  font-size: 1.1em;
}

.success-message, .game-over {
  text-align: center;
  margin: 30px auto;
  padding: 30px;
  background: white;
  color: #2c3e50;
  border-radius: 12px;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  animation: fadeIn 0.6s ease-out;
  position: relative;
  overflow: hidden;
}

.success-message::before, .game-over::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #2ecc71, #3498db);
}

.game-over::before {
  background: linear-gradient(90deg, #e74c3c, #e67e22);
}

.success-message h3, .game-over h3 {
  font-size: 2em;
  margin: 0 0 15px 0;
  color: #2c3e50;
  border: none;
  padding: 0;
}

.success-message h3::after, .game-over h3::after {
  display: none;
}

.success-message p, .game-over p {
  font-size: 1.1em;
  color: #555;
  margin: 10px 0 20px;
  line-height: 1.6;
}

.play-again-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1em;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
  margin-top: 15px;
}

.play-again-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.play-again-btn:active {
  transform: translateY(1px);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .task-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.8em;
  }
  
  h2 {
    font-size: 1.3em;
  }
  
  .matching-game {
    flex-direction: column;
    gap: 20px;
  }
  
  .column {
    margin-bottom: 20px;
    padding: 20px 15px;
  }
  
  .score-container {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 10px;
  }
  
  .success-message, .game-over {
    margin: 20px 10px;
    padding: 20px 15px;
  }
  
  .success-message h3, .game-over h3 {
    font-size: 1.6em;
  }
}
</style>
