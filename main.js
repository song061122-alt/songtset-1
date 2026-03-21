import { tarotCards } from './tarot_data.js';

let currentMode = 1; 
let selectedCards = [];
let isProcessing = false; // 애니메이션 중 클릭 방지

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    createStars();
    renderCards();
    setupModal();
    
    window.setMode = setMode; 
    const resultBtn = document.getElementById('view-results-btn');
    resultBtn.addEventListener('click', showResult);
});

function updateDate() {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    dateEl.textContent = now.toLocaleDateString('ko-KR', options);
}

function setMode(mode) {
    if (isProcessing) return;
    if (selectedCards.length > 0) {
        if (!confirm("진행 중인 선택이 초기화됩니다. 모드를 변경하시겠습니까?")) return;
    }
    
    currentMode = mode;
    resetState();
    
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById(`mode-${mode}`);
    if (targetBtn) targetBtn.classList.add('active');
    
    const statusText = document.getElementById('selection-status');
    if (statusText) {
        statusText.textContent = mode === 1 ? 
            "오늘 하루 당신에게 찾아올 행운의 메시지를 확인하세요. (1장 선택)" : 
            "과거, 현재, 미래를 아우르는 당신의 운명을 확인하세요. (3장 선택)";
        statusText.style.color = '';
    }
    
    renderCards();
}

function resetState() {
    selectedCards = [];
    isProcessing = false;
    const resultBtn = document.getElementById('view-results-btn');
    if (resultBtn) resultBtn.style.display = 'none';
}

function createStars() {
    const container = document.querySelector('.stars-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
        container.appendChild(star);
    }
}

// 이미지 로딩 실패 시 대체 텍스트와 스타일을 위한 함수
window.handleImgError = function(img) {
    img.onerror = null; // 무한 루프 방지
    img.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500&auto=format&fit=crop'; // 신비로운 분위기의 고정 대체 이미지
    img.alt = '신비로운 타로 카드';
    console.warn('이미지 로딩 실패로 대체 이미지를 표시합니다.');
};

function renderCards() {
    const container = document.getElementById('card-container');
    if (!container) return;
    container.innerHTML = '';
    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);

    shuffledCards.forEach((cardData) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">
                <img src="${cardData.image}" onerror="handleImgError(this)" loading="lazy">
            </div>
        `;
        card.addEventListener('click', (e) => handleCardClick(card, cardData, e));
        container.appendChild(card);
    });
}

function handleCardClick(cardElement, cardData, e) {
    if (isProcessing || cardElement.classList.contains('flipped')) return;
    
    // 클릭 이펙트
    const effect = document.createElement('div');
    effect.className = 'card-pick-effect';
    effect.style.left = `${e.pageX}px`;
    effect.style.top = `${e.pageY}px`;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 800);

    if (currentMode === 1) {
        isProcessing = true;
        selectedCards = [{ element: cardElement, data: cardData }];
        
        document.querySelectorAll('.card').forEach(c => {
            if (c !== cardElement) c.style.opacity = '0.2';
            c.style.pointerEvents = 'none';
        });
        
        cardElement.classList.add('flipped');
        setTimeout(showResult, 1000);
    } else {
        if (cardElement.classList.contains('selected')) {
            cardElement.classList.remove('selected');
            selectedCards = selectedCards.filter(item => item.element !== cardElement);
        } else if (selectedCards.length < 3) {
            cardElement.classList.add('selected');
            selectedCards.push({ element: cardElement, data: cardData });
        }
        updateStatus();
    }
}

function updateStatus() {
    const statusText = document.getElementById('selection-status');
    const resultBtn = document.getElementById('view-results-btn');
    if (!statusText || !resultBtn) return;

    if (currentMode === 3) {
        statusText.textContent = `운명의 흐름을 위해 3장의 카드를 선택해 주세요. (${selectedCards.length}/3)`;
        if (selectedCards.length === 3) {
            resultBtn.style.display = 'block';
            statusText.style.color = 'var(--gold-bright)';
        } else {
            resultBtn.style.display = 'none';
            statusText.style.color = '';
        }
    }
}

function showResult() {
    if (currentMode === 3 && selectedCards.length < 3) return;
    
    isProcessing = true;
    const modal = document.getElementById('result-modal');
    const resultArea = document.getElementById('result-area');
    if (!modal || !resultArea) return;
    
    if (currentMode === 1) {
        const card = selectedCards[0].data;
        const colors = ['골드', '실버', '바이올렛', '에메랄드', '로즈골드', '딥블루', '화이트'];
        const times = ['오전 8시', '정오', '오후 3시', '오후 6시', '오후 9시', '심야'];
        
        resultArea.innerHTML = `
            <div class="today-result-header">
                <span class="badge">Today's Card</span>
                <h2>${card.name}</h2>
                <p class="today-one-liner">"${card.summary}"</p>
            </div>
            <div class="today-result-body">
                <div class="today-card-view"><img src="${card.image}" onerror="handleImgError(this)"></div>
                <div class="today-text-view">
                    <div class="today-section">
                        <h3><i class="fa-solid fa-moon"></i> 오늘의 메시지</h3>
                        <p>${card.general}</p>
                    </div>
                    <div class="today-grid">
                        <div class="today-section"><h4><i class="fa-solid fa-heart"></i> 연애운</h4><p>${card.love}</p></div>
                        <div class="today-section"><h4><i class="fa-solid fa-coins"></i> 재물/직업</h4><p>${card.career}</p></div>
                    </div>
                    <div class="lucky-items">
                        <div class="lucky-item"><strong>🍀 컬러:</strong> ${colors[Math.floor(Math.random() * colors.length)]}</div>
                        <div class="lucky-item"><strong>⏰ 시간:</strong> ${times[Math.floor(Math.random() * times.length)]}</div>
                    </div>
                </div>
            </div>
            <div class="today-footer">
                <button class="btn-retry" onclick="location.reload()">다시 점치기</button>
            </div>
        `;
    } else {
        const labels = ['[과거] 당신의 발자취', '[현재] 당신의 지금', '[미래] 당신의 운명'];
        let cardsHtml = '';
        
        selectedCards.forEach((item, index) => {
            setTimeout(() => item.element.classList.add('flipped'), index * 200);
            cardsHtml += `
                <div class="result-item animate-fade-in" style="animation-delay: ${index * 0.2}s">
                    <h3>${labels[index]}</h3>
                    <img src="${item.data.image}" class="result-item-card" onerror="handleImgError(this)">
                    <div class="result-item-info">
                        <h4>${item.data.name}</h4>
                        <p class="general-desc">${item.data.general}</p>
                        <div class="detail-box">
                            <h5><i class="fa-solid fa-heart"></i> 연애운 포인트</h5>
                            <p>${item.data.love}</p>
                        </div>
                        <div class="detail-box">
                            <h5><i class="fa-solid fa-coins"></i> 재물운 포인트</h5>
                            <p>${item.data.career}</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        const summary = `당신의 운명은 과거의 '${selectedCards[0].data.name.split('.')[1]}'의 기운에서 시작되어 현재의 '${selectedCards[1].data.name.split('.')[1]}'의 상황을 거치고 있습니다. 앞으로 다가올 미래는 '${selectedCards[2].data.name.split('.')[1]}'의 흐름을 통해 새로운 전환점을 맞이하게 될 것입니다. 전체적으로 에너지가 순환하는 시기이니 자신감을 가지세요.`;

        resultArea.innerHTML = `
            <div class="multi-result-container">${cardsHtml}</div>
            <div class="comprehensive-summary animate-fade-in" style="animation-delay: 0.8s">
                <h3><i class="fa-solid fa-wand-sparkles"></i> 운명의 심층 분석 보고서</h3>
                <p>${summary}</p>
                <button class="btn-retry" style="margin-top:20px" onclick="location.reload()">새로운 운명 점치기</button>
            </div>
        `;
    }

    setTimeout(() => {
        modal.style.display = 'block';
        isProcessing = false;
    }, 1200);
}

function setupModal() {
    const modal = document.getElementById('result-modal');
    const closeBtn = document.querySelector('.close-btn');
    if (!modal || !closeBtn) return;

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        if (currentMode === 1) location.reload(); // 1장은 다시 뽑기 유도
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            if (currentMode === 1) location.reload();
        }
    };
}
