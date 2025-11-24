
const BACKEND_URL = "http://localhost:3000/chat";

let currentTopic = "";  // 현재 대화하는 주제를 저장

// 안이 ( 키워드 기반 )
function findRuleResponse(userInput) {
    const normalizedInput = userInput.toLowerCase().trim();
    if (!normalizedInput) return null;

    let bestMatch = null;
    let highestPriority = -1; // 0: 포함, 1: 정확히 일치함

    for (const rule of rules) {
        for (const keyword of rule.keywords) {  
            const normalizedKeyword = keyword.toLowerCase().trim();

            // 입력이 키워드와 정확히 일치할 때
            if (normalizedInput === normalizedKeyword) {
                if (1 > highestPriority) {
                    highestPriority = 1;
                    bestMatch = rule;
                }
            }
            // 입력이 키워드를 포함할때
            else if (normalizedInput.includes(normalizedKeyword)) {
                if (0 > highestPriority) {
                    highestPriority = 0;
                    bestMatch = rule;
                }
            }
        }
    }

    if (bestMatch) { // 일치하는 규칙을 찾았을 떄
        if (bestMatch.setTopic) { currentTopic = bestMatch.setTopic; }  // rules.js에 setTopic이 있다면

        // 챗봇 응답 형식으로 반환
        return {
            answer: bestMatch.answer,
            buttons: bestMatch.buttons || ["셔틀버스", "학과 안내", "학사일정"],
            imageUrl: 'img/안이2.png',
            source: 'rule'
        };
    }

    return null; // 일치하는 룰이 없음
}

// 산이 ( 제미나이 기반 )
async function getApiBotResponse(userInput) {
    try {
        const payload = {
            userInput: userInput,
            currentTopic: currentTopic 
        };

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // JSON.stringify로 Node.js 서버에 전송
            body: JSON.stringify(payload) 
        });

        if (!response.ok) {
            // Node.js 서버에서 발생한 오류 메시지를 받습니다.
            const err = await response.json(); 
            throw new Error(`백엔드 API 요청 실패 (${response.status}): ${err.error || '알 수 없는 오류'}`);
        }

        const data = await response.json();
        const answer = data.answer || "응답을 불러올 수 없습니다.";
        currentTopic = "";

        return {
            answer: answer,
            buttons: ["셔틀버스", "학과 안내", "학사일정"],
            imageUrl: 'img/산이1.png', 
            source: 'api'
        };            
    } 
    catch (error) {
        console.error("백엔드 서버 호출 오류:", error.message); 
        return {
            answer: "AI 서버와 연결할 수 없습니다. 😥",
            buttons: ["셔틀버스", "학과 안내", "학사일정"],
            imageUrl: 'img/안이2.png',
            source: 'error'
        };
    }
}
// ========================== 챗봇 UI ==========================
const widget = document.getElementById('ani-chatbot-widget');
const aniImage = document.getElementById('ani-image');
const modal = document.getElementById('chat-modal');
const wrapper = document.querySelector('.chat-modal-wrapper');
const header = document.querySelector('.chat-header');
const modalLogo = document.querySelector('.ani-logo-absolute');
const closeBtn = document.getElementById('chat-close-btn');
const maximizeBtn = document.getElementById('chat-maximize-btn');
const minimizeBtn = document.getElementById('chat-minimize-btn');
const maximizeIcon = maximizeBtn.querySelector('i');
const chatBody = document.querySelector('.chat-body');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');

let isDragging = false;
let currentTranslate = { x: 0, y: 0 };
let startDragPos = { x: 0, y: 0 };

widget.addEventListener('mouseover', () => { aniImage.src = 'img/안이3.png'; });
widget.addEventListener('mouseout', () => { aniImage.src = 'img/안이2.png'; });

widget.addEventListener('click', () => {
    modal.classList.add('show');
    minimizeBtn.style.display = 'none';
    maximizeBtn.style.display = 'block';
    wrapper.style.transform = 'translate(0, 0)';
    currentTranslate = { x: 0, y: 0 };

    if (chatBody.children.length === 0) {
        const initialResponse = findRuleResponse("안녕"); 
        
        if (initialResponse) {  appendMessage(initialResponse.answer, 'bot', initialResponse.imageUrl, initialResponse.buttons); } 
        else { appendMessage("안녕하세요! 안산대학교 챗봇 안이입니다. 무엇을 도와드릴까요?", 'bot', 'img/안이2.png', ["셔틀버스", "학과 안내", "학사일정"]); }
        modalLogo.src = 'img/안이1.png'; 
        modalLogo.alt = '안이 로고';
    }
});

function closeModal() {
    modal.classList.remove('show');
    wrapper.classList.remove('modal-maximized');
    wrapper.style.transform = 'translate(0, 0)';
    currentTranslate = { x: 0, y: 0 };
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function toggleMaximize() {
    const maximized = wrapper.classList.toggle('modal-maximized');
    maximizeIcon.className = maximized ? 'fas fa-window-restore' : 'fas fa-window-maximize';
    minimizeBtn.style.display = 'none';
    if (!maximized) {
        wrapper.style.transform = 'translate(0, 0)';
        currentTranslate = { x: 0, y: 0 };
    }
}
maximizeBtn.addEventListener('click', toggleMaximize);

header.addEventListener('mousedown', e => {
    if (wrapper.classList.contains('modal-maximized')) return;
    isDragging = true;
    startDragPos.x = e.clientX - currentTranslate.x;
    startDragPos.y = e.clientY - currentTranslate.y;
    wrapper.style.transition = 'none';
    header.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    currentTranslate.x = e.clientX - startDragPos.x;
    currentTranslate.y = e.clientY - startDragPos.y;
    wrapper.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
});

document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.transition = '';
    header.style.cursor = 'move';
});

function appendMessage(text, type, imageUrl = 'img/안이2.png', buttons = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', ...type.split(' '));

    if (type.includes('bot')) {
        const img = document.createElement('img');
        img.src = imageUrl;
        let altText = '안이 챗봇';
        if (imageUrl && imageUrl.includes('산이')) {
            altText = '산이 챗봇'; 
        }
        img.alt = altText;
        messageDiv.appendChild(img);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('bot-content-wrapper');

    const textSpan = document.createElement('span');
    textSpan.innerHTML = text;
    contentWrapper.appendChild(textSpan);

    if (buttons && buttons.length > 0) {
        const existingButtons = document.querySelectorAll('.quick-reply-btn:not([disabled])');
        existingButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'default';
            btn.style.backgroundColor = '#f0f0f0';
            btn.style.color = '#aaa';
            btn.style.borderColor = '#ddd';
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('quick-reply-buttons');

        buttons.forEach(buttonText => {
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.classList.add('quick-reply-btn');
            button.addEventListener('click', () => handleQuickReplyClick(buttonText));
            buttonContainer.appendChild(button);
        });
        contentWrapper.appendChild(buttonContainer);
    }

    messageDiv.appendChild(contentWrapper);
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return messageDiv;
}

function handleQuickReplyClick(buttonText) {
    appendMessage(buttonText, 'user');
    chatInput.value = buttonText;
    sendMessage(true);
}

async function sendMessage(isQuickReply = false) {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    if (!isQuickReply) appendMessage(userMessage, 'user');
    chatInput.value = '';

    const ruleCheck = findRuleResponse(userMessage);

    let thinkingImageSrc;
    let finalResponsePromise;
    let startTime = Date.now();

    if (ruleCheck) {
        thinkingImageSrc = 'img/안이2.png';
        finalResponsePromise = Promise.resolve(ruleCheck);
    } else {
        thinkingImageSrc = 'img/산이2.png'; // 산이의 생각 중 이미지
        finalResponsePromise = getApiBotResponse(userMessage);
    }
    
    const thinkingMessage = appendMessage('생각 중...', 'bot thinking', thinkingImageSrc);
    const botResponse = await finalResponsePromise;

    if (ruleCheck) {
    const elapsedTime = Date.now() - startTime;
    const minimumDelay = 500; 
    if (elapsedTime < minimumDelay) {
        await new Promise(resolve => setTimeout(resolve, minimumDelay - elapsedTime));
    }
}

    if (thinkingMessage && thinkingMessage.parentNode) {
        chatBody.removeChild(thinkingMessage);
    }

    const defaultLogoSrc = 'img/안이1.png';
    const saniLogoSrc = 'img/산이1.png';
    


    if (botResponse.imageUrl && botResponse.imageUrl.includes('산이')) {
        modalLogo.src = saniLogoSrc; 
        modalLogo.alt = '산이 로고';
    } else {
        modalLogo.src = defaultLogoSrc;
        modalLogo.alt = '안이 로고';
    }

    appendMessage(botResponse.answer, 'bot', botResponse.imageUrl, botResponse.buttons);
    chatBody.scrollTop = chatBody.scrollHeight;
}

chatSendBtn.addEventListener('click', () => sendMessage(false));
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(false); });
