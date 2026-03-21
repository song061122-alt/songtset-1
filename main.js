import { tarotCards } from './tarot_data.js';

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    renderCards();
    setupModal();
});

// 배경 별 생성
function createStars() {
    const container = document.querySelector('.stars-container');
    const count = 150;

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = Math.random() * 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = 2 + Math.random() * 3;
        const delay = Math.random() * 5;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;

        container.appendChild(star);
    }
}

// 카드 렌더링 및 셔플
function renderCards() {
    const container = document.getElementById('card-container');
    // 실제 서비스라면 더 많은 카드를 셔플하겠지만, 여기서는 데이터셋을 셔플하여 표시
    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);

    shuffledCards.forEach((cardData, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = cardData.id;

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <img src="${cardData.image}" alt="${cardData.name}">
            </div>
        `;

        card.addEventListener('click', () => selectCard(card, cardData));
        container.appendChild(card);
    });
}

// 카드 선택 로직
function selectCard(cardElement, cardData) {
    if (cardElement.classList.contains('flipped')) return;

    // 모든 카드 클릭 방지 (하나만 선택 가능하게)
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(c => c.style.pointerEvents = 'none');

    // 카드 뒤집기 애니메이션
    cardElement.classList.add('flipped');

    // 잠시 후 결과 모달 표시
    setTimeout(() => {
        showResult(cardData);
    }, 1000);
}

// 결과 모달 표시
function showResult(cardData) {
    const modal = document.getElementById('result-modal');
    const img = document.getElementById('result-card-img');
    const name = document.getElementById('result-card-name');
    const meaning = document.getElementById('result-card-meaning');

    img.src = cardData.image;
    name.textContent = cardData.name;
    meaning.textContent = cardData.meaning;

    modal.style.display = 'block';
}

// 모달 닫기 설정
function setupModal() {
    const modal = document.getElementById('result-modal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        // 다시 뽑을 수 있게 페이지 리로드 유도 또는 상태 초기화
        location.reload(); 
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            location.reload();
        }
    };
}
