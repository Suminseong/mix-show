class SurveyApp {
    static scoreLabels = {
        1: 'Very dissimilar',
        2: 'Not similar',
        3: 'Average',
        4: 'Similar',
        5: 'Very similar'
    };
    copyResultsToClipboard() {
        const results = this.buildExportResults();
        const json = JSON.stringify(results, null, 2);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(json).then(() => {
                alert('설문 결과가 클립보드에 복사되었습니다!');
            }, () => {
                alert('클립보드 복사에 실패했습니다.');
            });
        } else {
            // fallback for old browsers
            const textarea = document.createElement('textarea');
            textarea.value = json;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('설문 결과가 클립보드에 복사되었습니다!');
            } catch (e) {
                alert('클립보드 복사에 실패했습니다.');
            }
            document.body.removeChild(textarea);
        }
    }
    // 참가자 정보 입력을 위한 필드 추가
    participantName = '';
    participantAge = '';
    participantInfoEntered = false;

    // 세션 분류용 데이터 분리
    getSessionData() {
        // 일반 단어: 명사(n), 형용사(a), 동사(v)
        const generalWords = this.surveyData.filter(q => ['n', 'a', 'v'].includes(q.category));
        // 문화적 맥락 단어: cult
        const culturalWords = this.surveyData.filter(q => q.category === 'cult');
        return {
            general: generalWords,
            cultural: culturalWords
        };
    }

    // 설문 결과를 예시 구조로 변환
    buildExportResults() {
        const sessions = this.getSessionData();
        // responses 배열을 session별로 분리
        const generalResponses = [];
        const culturalResponses = [];
        for (const r of this.responses) {
            const q = this.surveyData[r.questionIndex];
            if (["n", "a", "v"].includes(q.category)) {
                generalResponses.push({
                    word: q.word,
                    meaningRating: r.meaningRating,
                    expressionRating: r.expressionRating
                });
            } else if (q.category === "cult") {
                culturalResponses.push({
                    word: q.word,
                    meaningRating: r.meaningRating,
                    culturalContextRating: r.culturalContextRating,
                    expressionRating: r.expressionRating
                });
            }
        }
        // 자유 의견 내용 추출
        let feedback = '';
        const feedbackElem = document.getElementById('freeFeedback');
        if (feedbackElem) {
            feedback = feedbackElem.value;
        }
        return {
            participantName: this.participantName,
            age: this.participantAge,
            feedback,
            answers: [
                {
                    sessionType: '일반 단어',
                    responses: generalResponses
                },
                {
                    sessionType: '문화적 맥락 단어',
                    responses: culturalResponses
                }
            ]
        };
    }
    
    constructor() {
        this.currentQuestion = 0;
        this.totalQuestions = 50;
        this.responses = [];
        this.startTime = null;
        this.imageData = [];
        this.sentences = [];
        
        this.initializeData();
        this.initializeElements();
        this.setupEventListeners();
        this.startSurvey();
    }
    
    initializeData() {
        this.surveyData = [
            {"word": "ladder", "category": "n", "table": "n", "sentence": "He climbed up the ladder to fix the light."},
            {"word": "glove", "category": "n", "table": "n", "sentence": "She wears a glove when she cleans."},
            {"word": "seed", "category": "n", "table": "n", "sentence": "The farmer planted a seed in the soil."},
            {"word": "nest", "category": "n", "table": "n", "sentence": "The bird is sitting in its nest."},
            {"word": "castle", "category": "n", "table": "n", "sentence": "They visited an old castle in Europe."},
            {"word": "cave", "category": "n", "table": "n", "sentence": "The bear is sleeping in the cave."},
            {"word": "hive", "category": "n", "table": "n", "sentence": "Bees are busy around the hive."},
            {"word": "accident", "category": "n", "table": "n", "sentence": "There was a car accident on the road."},
            {"word": "actor", "category": "n", "table": "n", "sentence": "He wants to be a famous actor."},
            {"word": "adoption", "category": "n", "table": "n", "sentence": "The family celebrated their child’s adoption day."},
            {"word": "crawl", "category": "v", "table": "n", "sentence": "The baby can crawl now."},
            {"word": "dive", "category": "v", "table": "n", "sentence": "She loves to dive into the pool."},
            {"word": "bend", "category": "v", "table": "n", "sentence": "He bent down to tie his shoes."},
            {"word": "pour", "category": "v", "table": "n", "sentence": "Pour the water into the glass."},
            {"word": "stir", "category": "v", "table": "n", "sentence": "Stir the soup with a spoon."},
            {"word": "lift", "category": "v", "table": "n", "sentence": "He lifted the heavy box."},
            {"word": "chase", "category": "v", "table": "n", "sentence": "The dog chased the cat."},
            {"word": "absorb", "category": "v", "table": "n", "sentence": "A sponge absorbs water quickly."},
            {"word": "act", "category": "v", "table": "n", "sentence": "Actors act on stage."},
            {"word": "admire", "category": "v", "table": "n", "sentence": "She admires the beautiful painting."},
            {"word": "empty", "category": "a", "table": "n", "sentence": "The box is empty."},
            {"word": "full", "category": "a", "table": "n", "sentence": "The glass is full of milk."},
            {"word": "wet", "category": "a", "table": "n", "sentence": "His clothes are wet from the rain."},
            {"word": "dirty", "category": "a", "table": "n", "sentence": "The floor is dirty."},
            {"word": "quiet", "category": "a", "table": "n", "sentence": "The library is very quiet."},
            {"word": "crowded", "category": "a", "table": "n", "sentence": "The subway was crowded this morning."},
            {"word": "lonely", "category": "a", "table": "n", "sentence": "She felt lonely in the big city."},
            {"word": "abrupt", "category": "a", "table": "n", "sentence": "His departure was abrupt."},
            {"word": "absent", "category": "a", "table": "n", "sentence": "He was absent from school today."},
            {"word": "absolute", "category": "a", "table": "n", "sentence": "She has absolute trust in her friend."},
            {"word": "Thanksgiving Day", "category": "cult", "table": "c", "sentence": "They have a big dinner on Thanksgiving Day."},
            {"word": "Halloween", "category": "cult", "table": "c", "sentence": "Kids wear costumes on Halloween."},
            {"word": "prom", "category": "cult", "table": "c", "sentence": "She is excited about the prom night."},
            {"word": "garage sale", "category": "cult", "table": "c", "sentence": "They sold old stuff at a garage sale."},
            {"word": "potluck", "category": "cult", "table": "c", "sentence": "Everyone brought food to the potluck."},
            {"word": "spring break", "category": "cult", "table": "c", "sentence": "Students travel during spring break."},
            {"word": "yard sale", "category": "cult", "table": "c", "sentence": "They had a yard sale last weekend."},
            {"word": "Black Friday", "category": "cult", "table": "c", "sentence": "Shops are crowded on Black Friday."},
            {"word": "brunch", "category": "cult", "table": "c", "sentence": "They had brunch at a cafe."},
            {"word": "PTA meeting", "category": "cult", "table": "c", "sentence": "My mom went to the PTA meeting."}
        ];
        this.totalQuestions = this.surveyData.length;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    initializeElements() {
        this.surveyContainer = document.getElementById('surveyContainer');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        this.surveyImage = document.getElementById('surveyImage');
        this.sentenceText = document.getElementById('sentenceText');
        this.nextButton = document.getElementById('nextButton');
        this.restartButton = document.getElementById('restartButton');
        this.averageScore = document.getElementById('averageScore');
        this.totalTime = document.getElementById('totalTime');
        this.resultChart = document.getElementById('resultChart');
        // ratingSlider, sliderValue는 더 이상 사용하지 않으므로 찾지 않음
        this.totalQuestionsSpan.textContent = this.totalQuestions;
    }
    
    setupEventListeners() {
        // ratingSlider, sliderValue 관련 이벤트 제거
        this.nextButton.addEventListener('click', () => {
            this.submitResponse();
        });
        this.restartButton.addEventListener('click', () => {
            this.restartSurvey();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.surveyContainer.style.display !== 'none') {
                this.submitResponse();
            }
        });
    }
    
    startSurvey() {
        this.startTime = new Date();
        this.currentQuestion = 0;
        this.responses = [];
        this.showQuestion();
    }
    
    showQuestion() {
        if (!this.participantInfoEntered) {
            this.showParticipantInfoForm();
            return;
        }
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }
        const questionData = this.surveyData[this.currentQuestion];
        this.currentQuestionSpan.textContent = this.currentQuestion + 1;
        // 이미지 처리
        const word = questionData.word.replace(/ /g, '_');
        const imageBasePath = `images/${word}_1`;
        const trySetImage = (exts, idx = 0) => {
            if (idx >= exts.length) {
                this.surveyImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjdGQUZDIi8+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIzOTgiIGhlaWdodD0iMjk4IiBzdHJva2U9IiNFMkU4RjAiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIyMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5QTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5JbWFnZSAke3RoaXMuY3VycmVudFF1ZXN0aW9uICsgMX08L3RleHQ+Cjwvc3ZnPg==';
                return;
            }
            this.surveyImage.onerror = () => trySetImage(exts, idx + 1);
            this.surveyImage.src = `${imageBasePath}.${exts[idx]}`;
        };
        trySetImage(['png', 'jpg']);
        this.surveyImage.alt = `${questionData.word}`;
        this.sentenceText.textContent = questionData.sentence;
        // target-voca 클래스에 단어 띄우기
        const targetVocaElem = document.querySelector('.target-voca');
        if (targetVocaElem) {
            targetVocaElem.textContent = questionData.word;
        }

        // 슬라이더 UI: 일반/문화 구분
        let sliderLabels = [];
        if (['n', 'a', 'v'].includes(questionData.category)) {
            sliderLabels = ['meaning similarity', 'expression similarity'];
        } else if (questionData.category === 'cult') {
            sliderLabels = ['meaning similarity', 'cultural context similarity', 'expression similarity'];
        }
        // 슬라이더 개수 맞추기: 이미 생성된 슬라이더와 다르면 새로 생성
        if (!this.sliderRefs || this.sliderRefs.length !== sliderLabels.length) {
            this.showSliders(sliderLabels);
        } else {
            // 라벨만 맞춰주기 (혹시 다를 경우)
            this.sliderRefs.forEach((ref, idx) => {
                if (ref.label !== sliderLabels[idx]) {
                    this.showSliders(sliderLabels);
                }
            });
        }
        // 슬라이더 값 초기화 (sliderRefs가 있고, 각 ref가 정상적으로 slider/valueSpan을 가질 때만)
        if (this.sliderRefs && Array.isArray(this.sliderRefs)) {
            this.sliderRefs.forEach(ref => {
                if (ref && ref.slider) ref.slider.value = 3;
                if (ref && ref.valueSpan) ref.valueSpan.textContent = SurveyApp.scoreLabels[3];
            });
        }
        // ratingSlider, sliderValue는 더 이상 사용하지 않으므로 접근하지 않음
    }

    // 참가자 정보 입력 폼 표시
    showParticipantInfoForm() {
        // 간단한 프롬프트로 구현 (실제 서비스는 별도 모달/폼 권장)
        const name = prompt('이름을 입력하세요(Name): ');
        if (!name) return;
        const age = prompt('만 나이를 입력하세요(Age):');
        if (!age) return;
        const exp = prompt('교원 경력(년)을 입력하세요(Teaching Experience):');
        if (!age) return;
        this.participantName = name;
        this.participantAge = age;
        this.participantInfoEntered = true;
        this.showQuestion();
    }

    // 슬라이더 UI 표시 함수 (슬라이더 2개/3개 동적 생성)
    showSliders(labels) {
        // 기존 슬라이더 영역 비우기
        const sliderArea = document.getElementById('sliderArea');
        sliderArea.innerHTML = '';

        // 점수별 문구 매핑
        const scoreLabels = SurveyApp.scoreLabels;

        this.sliderRefs = [];
        labels.forEach((label, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'slider-wrapper';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.margin = '6px 0 6px 0';

            const labelElem = document.createElement('label');
            labelElem.textContent = label;
            labelElem.style.marginRight = '6px';
            labelElem.style.fontWeight = 'bold';
            labelElem.style.fontSize = '1em';

            // 구간 라벨
            const minLabel = document.createElement('span');
            minLabel.textContent = '1';
            minLabel.style.margin = '0 8px 0 8px';
            minLabel.style.color = '#888';
            minLabel.style.fontSize = '0.95em';
            const maxLabel = document.createElement('span');
            maxLabel.textContent = '5';
            maxLabel.style.margin = '0 8px 0 8px';
            maxLabel.style.color = '#888';
            maxLabel.style.fontSize = '0.95em';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = 1;
            slider.max = 5;
            slider.value = 3;
            slider.className = 'ratingSlider';
            slider.style.verticalAlign = 'middle';
            slider.style.width = '220px';
            slider.style.margin = '0 10px';
            slider.style.accentColor = '#3182ce';
            slider.style.background = 'transparent';

            // 점수 값(문구)
            const valueSpan = document.createElement('span');
            valueSpan.textContent = scoreLabels[3];
            valueSpan.className = 'sliderValue';
            valueSpan.style.marginLeft = '12px';
            valueSpan.style.fontWeight = 'bold';
            valueSpan.style.fontSize = '1.1em';
            valueSpan.style.color = '#2b6cb0';

            slider.addEventListener('input', (e) => {
                valueSpan.textContent = scoreLabels[e.target.value] || e.target.value;
            });

            wrapper.appendChild(labelElem);
            wrapper.appendChild(minLabel);
            wrapper.appendChild(slider);
            wrapper.appendChild(maxLabel);
            wrapper.appendChild(valueSpan);
            sliderArea.appendChild(wrapper);
            this.sliderRefs.push({slider, valueSpan, label});
        });
    }
    
    submitResponse() {
        // 슬라이더 값 읽기
        const questionData = this.surveyData[this.currentQuestion];
        // sliderRefs가 없거나 길이가 부족하면 무시 (중복 submit 방지)
        if (!this.sliderRefs || (['n','a','v'].includes(questionData.category) && this.sliderRefs.length < 2) || (questionData.category === 'cult' && this.sliderRefs.length < 3)) {
            return;
        }
        let response = { questionIndex: this.currentQuestion, timestamp: new Date() };
        if (['n', 'a', 'v'].includes(questionData.category)) {
            response.meaningRating = parseInt(this.sliderRefs[0].slider.value);
            response.expressionRating = parseInt(this.sliderRefs[1].slider.value);
        } else if (questionData.category === 'cult') {
            response.meaningRating = parseInt(this.sliderRefs[0].slider.value);
            response.culturalContextRating = parseInt(this.sliderRefs[1].slider.value);
            response.expressionRating = parseInt(this.sliderRefs[2].slider.value);
        }
        this.responses.push(response);
        this.currentQuestion++;
        this.showQuestion();
    }
    
    showResults() {
        this.surveyContainer.style.display = 'none';
        this.resultsContainer.style.display = 'block';
        // 결과 그래프 및 점수 표시 기능 제거됨
        this.averageScore.innerHTML = '';
        this.totalTime.textContent = '';
        this.resultChart.innerHTML = '';

        // 자유 의견 입력 칸 추가
        let feedbackBox = document.getElementById('surveyFeedbackBox');
        if (!feedbackBox) {
            feedbackBox = document.createElement('div');
            feedbackBox.id = 'surveyFeedbackBox';
            feedbackBox.style.margin = '32px 0 0 0';
            feedbackBox.innerHTML = `
                <label for="freeFeedback" style="font-size:1.1em;font-weight:500;display:block;margin-bottom:8px;">자유롭게 의견을 남겨주세요</label>
                <textarea id="freeFeedback" rows="5" style="width:100%;max-width:600px;padding:12px;font-size:1em;border-radius:8px;border:1.5px solid #cbd5e1;resize:vertical;"></textarea>
            `;
            this.resultsContainer.appendChild(feedbackBox);
        }
    }
    
    // 결과 그래프 및 점수 관련 함수 삭제
    
    restartSurvey() {
        this.resultsContainer.style.display = 'none';
        this.surveyContainer.style.display = 'block';
        this.startSurvey();
    }


    exportResults() {
        const results = this.buildExportResults();
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `survey_results_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const surveyApp = new SurveyApp();
    window.surveyAppInstance = surveyApp;
    window.exportResults = () => surveyApp.exportResults();
    window.copyResultsToClipboard = () => surveyApp.copyResultsToClipboard();
});

// 이메일로 결과 자동 전송되게.
// 슬라이더 라벨링, 설명
// 예문 라벨
// 단어 빠졌음

// 어떤 목적 설문이다, 몇분 걸린다 기본 설명
// 이름, 교육 경력, 연령, 소속 입력
// 언어 대응(최대한 수월하게) - 아니면 영어로? - 일단 영어로 만들어버리자

// JSON 전송하기 버튼 기능: 이메일 클라이언트로 결과 전송 시도
window.sendResultsByEmail = () => {
    // 이미 설문이 끝난 상태에서 버튼이 눌리므로, 기존 SurveyApp 인스턴스 재사용
    const surveyApp = window.surveyAppInstance || new SurveyApp();
    const results = surveyApp.buildExportResults();
    const json = JSON.stringify(results, null, 2);
    const fromName = surveyApp.participantName || "익명";
    // emailjs 초기화 (최초 1회만 필요)
    if (!window._emailjsInitialized) {
        emailjs.init("YV5w2VNyhtNslKhE8"); 
        window._emailjsInitialized = true;
    }
    emailjs.send("service_exo1946", "template_dq14qz5", {
        from_name: fromName,
        message: json
    }).then(function(response) {
        alert("이메일 전송이 완료되었습니다!");
    }, function(error) {
        alert("이메일 전송에 실패했습니다. 다시 시도해 주세요.");
    });
};