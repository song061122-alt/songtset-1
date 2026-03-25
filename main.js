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
    window.showPrivacyPolicy = showPrivacyPolicy;
    window.showTermsOfService = showTermsOfService;
    window.showAbout = showAbout;
    window.closePolicyModal = closePolicyModal;
    window.shareKakao = shareKakao;
    window.copyLink = copyLink;

    const resultBtn = document.getElementById('view-results-btn');
    resultBtn.addEventListener('click', showResult);
});

function showPrivacyPolicy() {
    const modal = document.getElementById('policy-modal');
    const content = document.getElementById('policy-content');
    content.innerHTML = `
        <h2>개인정보처리방침</h2>
        <p>본 사이트(이하 '회사')는 이용자의 개인정보를 중요시하며, "개인정보보호법" 등 관련 법령을 준수하고 있습니다.</p>
        
        <h3>1. 개인정보의 수집 항목 및 방법</h3>
        <p>회사는 별도의 회원가입 절차 없이 서비스를 제공하며, 이용자의 개인식별정보(이름, 연락처 등)를 수집하거나 저장하지 않습니다.</p>
        
        <h3>2. 광고 게재 및 쿠키(Cookie) 사용</h3>
        <p>본 사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google을 포함한 제3자 제공업체는 쿠키를 사용하여 이용자의 이전 방문을 토대로 광고를 게재합니다.</p>
        <ul>
            <li>Google은 광고 쿠키를 사용하여 이용자가 본 사이트 또는 다른 사이트를 방문한 기록을 토대로 맞춤형 광고를 제공할 수 있습니다.</li>
            <li>이용자는 Google의 <a href="https://adssettings.google.com" target="_blank">광고 설정</a>에서 맞춤설정 광고 게재를 중단할 수 있습니다.</li>
        </ul>

        <h3>3. 개인정보의 보유 및 이용기간</h3>
        <p>회사는 이용자의 개인정보를 저장하지 않으므로 보유 및 이용기간이 존재하지 않습니다. 다만, 브라우저 로컬스토리지를 통해 저장되는 설정값은 이용자가 직접 삭제할 수 있습니다.</p>

        <h3>4. 이용자의 권리</h3>
        <p>이용자는 언제든지 본인의 브라우저 설정에서 쿠키 수집을 거부하거나 삭제할 권리가 있습니다.</p>
    `;
    modal.style.display = 'block';
}

function showTermsOfService() {
    const modal = document.getElementById('policy-modal');
    const content = document.getElementById('policy-content');
    content.innerHTML = `
        <h2>이용약관</h2>
        
        <h3>제1조 (목적)</h3>
        <p>본 약관은 '신비로운 타로 운세'(이하 '사이트')가 제공하는 모든 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>

        <h3>제2조 (서비스의 성격 및 한계)</h3>
        <p>1. 본 사이트가 제공하는 타로 운세 결과는 과학적 근거가 없는 엔터테인먼트 목적의 콘텐츠입니다.<br>
           2. 서비스 이용 결과에 대한 최종적인 판단과 책임은 이용자 본인에게 있으며, 사이트는 어떠한 법적 책임도 지지 않습니다.<br>
           3. 점술 결과는 상담을 대체할 수 없으며, 중요한 결정(금융, 의료, 법률 등) 시 전문가와 상담하시기 바랍니다.</p>

        <h3>제3조 (이용자의 의무)</h3>
        <p>이용자는 본 사이트를 불법적인 용도로 이용하거나 시스템에 위해를 가하는 행위를 해서는 안 됩니다.</p>

        <h3>제4조 (지적재산권)</h3>
        <p>본 사이트에서 제공하는 디자인, 코드, 콘텐츠(타로 설명글 등)의 저작권은 사이트 운영자에게 있으며, 무단 복제 및 배포를 금지합니다. 타로 카드 이미지는 퍼블릭 도메인(Public Domain) 또는 적법한 출처를 가진 자료를 사용합니다.</p>
    `;
    modal.style.display = 'block';
}

function showAbout() {
    const modal = document.getElementById('policy-modal');
    const content = document.getElementById('policy-content');
    content.innerHTML = `
        <h2>사이트 소개</h2>
        <p>신비로운 타로 운세는 라이더 웨이트 타로 시스템을 현대적으로 재해석하여 사용자들에게 매일의 조언과 통찰을 제공하는 웹 서비스입니다.</p>
        <p>우리는 모든 사람이 자신의 내면을 들여다보고 보다 긍정적인 방향으로 하루를 설계할 수 있도록 돕는 것을 목표로 합니다.</p>
        <p>본 사이트는 반응형 웹 기술을 적용하여 PC와 모바일 어디서나 최적화된 경험을 제공합니다.</p>
    `;
    modal.style.display = 'block';
}

function closePolicyModal() {
    document.getElementById('policy-modal').style.display = 'none';
}

function shareKakao() {
    alert("카카오톡 공유 기능은 실제 도메인이 연결되고 카카오 개발자 키가 설정되어야 작동합니다.\n\n현재는 링크 복사를 이용해 주세요.");
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert("링크가 복사되었습니다. 친구들에게 운세를 공유해보세요!");
    }).catch(err => {
        console.error('복사 실패:', err);
    });
}

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
