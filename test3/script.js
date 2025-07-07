class SurveyApp {
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
        this.imageData = this.generateSampleImageData();
        this.sentences = this.generateSampleSentences();
        
        const combined = this.imageData.map((img, index) => ({
            image: img,
            sentence: this.sentences[index % this.sentences.length]
        }));
        
        this.surveyData = this.shuffleArray(combined).slice(0, this.totalQuestions);
    }
    
    generateSampleImageData() {
        const sampleImages = [];
        for (let i = 1; i <= 100; i++) {
            sampleImages.push(`images/image${i}.jpg`);
        }
        return sampleImages;
    }
    
    generateSampleSentences() { // 임시데이터. 나중에 json 파일로 대체
        return [
            "I lost my wallet.",
            "The cat is sleeping on the sofa.",
            "She is reading a book in the library.",
            "The car is parked in the garage.",
            "He is cooking dinner in the kitchen.",
            "The children are playing in the park.",
            "The dog is running in the yard.",
            "She is writing a letter to her friend.",
            "The bird is flying in the sky.",
            "He is watching TV in the living room.",
            "The flowers are blooming in the garden.",
            "She is listening to music on her phone.",
            "The sun is shining brightly today.",
            "He is walking to the store.",
            "The rain is falling on the roof.",
            "She is painting a picture on canvas.",
            "The coffee is hot and steaming.",
            "He is riding his bicycle to work.",
            "The book is lying on the table.",
            "She is dancing in the room.",
            "The moon is visible in the night sky.",
            "He is playing guitar in his room.",
            "The tree is growing in the backyard.",
            "She is swimming in the pool.",
            "The clock is ticking on the wall.",
            "He is studying for his exam.",
            "The phone is ringing loudly.",
            "She is shopping at the mall.",
            "The wind is blowing through the trees.",
            "He is sleeping in his bed.",
            "The door is open to the garden.",
            "She is driving to the office.",
            "The water is flowing in the river.",
            "He is eating lunch at the restaurant.",
            "The fire is burning in the fireplace.",
            "She is talking on the phone.",
            "The computer is running slowly.",
            "He is cleaning his room.",
            "The stars are shining in the sky.",
            "She is waiting for the bus.",
            "The baby is crying in the crib.",
            "He is working in the office.",
            "The food is delicious and warm.",
            "She is exercising in the gym.",
            "The television is too loud.",
            "He is playing with his friends.",
            "The weather is cold and windy.",
            "She is teaching her students.",
            "The music is playing softly.",
            "He is fixing his car in the garage."
        ];
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
        this.ratingSlider = document.getElementById('ratingSlider');
        this.sliderValue = document.getElementById('sliderValue');
        this.nextButton = document.getElementById('nextButton');
        this.restartButton = document.getElementById('restartButton');
        this.averageScore = document.getElementById('averageScore');
        this.totalTime = document.getElementById('totalTime');
        this.resultChart = document.getElementById('resultChart');
        
        this.totalQuestionsSpan.textContent = this.totalQuestions;
    }
    
    setupEventListeners() {
        this.ratingSlider.addEventListener('input', (e) => {
            this.sliderValue.textContent = e.target.value;
        });
        
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
        if (this.currentQuestion >= this.totalQuestions) {
            this.showResults();
            return;
        }
        
        const questionData = this.surveyData[this.currentQuestion];
        
        this.currentQuestionSpan.textContent = this.currentQuestion + 1;
        
        this.surveyImage.src = questionData.image;
        this.surveyImage.alt = `Survey Image ${this.currentQuestion + 1}`;
        
        this.surveyImage.onerror = () => { //에러 대응용 이미지
            this.surveyImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjdGQUZDIi8+CjxyZWN0IHg9IjEiIHk9IjEiIHdpZHRoPSIzOTgiIGhlaWdodD0iMjk4IiBzdHJva2U9IiNFMkU4RjAiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIyMDAiIHk9IjE1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5QTNBRiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5JbWFnZSAke3RoaXMuY3VycmVudFF1ZXN0aW9uICsgMX08L3RleHQ+Cjwvc3ZnPg==';
        };
        
        this.sentenceText.textContent = questionData.sentence;
        
        this.ratingSlider.value = 3;
        this.sliderValue.textContent = '3';
        
        this.ratingSlider.focus();
    }
    
    submitResponse() {
        const rating = parseInt(this.ratingSlider.value);
        
        this.responses.push({
            questionIndex: this.currentQuestion,
            image: this.surveyData[this.currentQuestion].image,
            sentence: this.surveyData[this.currentQuestion].sentence,
            rating: rating,
            timestamp: new Date()
        });
        
        this.currentQuestion++;
        this.showQuestion();
    }
    
    showResults() {
        this.surveyContainer.style.display = 'none';
        this.resultsContainer.style.display = 'block';
        
        const totalScore = this.responses.reduce((sum, response) => sum + response.rating, 0);
        const averageScore = (totalScore / this.responses.length).toFixed(1);
        
        const endTime = new Date();
        const totalTimeMs = endTime - this.startTime;
        const totalTimeMinutes = Math.floor(totalTimeMs / 60000);
        const totalTimeSeconds = Math.floor((totalTimeMs % 60000) / 1000);
        
        this.averageScore.textContent = averageScore;
        this.totalTime.textContent = `${totalTimeMinutes}분 ${totalTimeSeconds}초`;
        
        this.createRatingChart();
        
        console.log('Survey Results:', {
            responses: this.responses,
            averageScore: averageScore,
            totalTime: totalTimeMs,
            ratingDistribution: this.calculateRatingDistribution()
        });
    }
    
    calculateRatingDistribution() {
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        this.responses.forEach(response => {
            distribution[response.rating]++;
        });
        return distribution;
    }
    
    createRatingChart() {
        const distribution = this.calculateRatingDistribution();
        const maxCount = Math.max(...Object.values(distribution));
        
        let chartHTML = '<h3 style="margin-bottom: 20px; color: #4a5568;">점수별 응답 분포</h3>';
        
        for (let rating = 1; rating <= 5; rating++) {
            const count = distribution[rating];
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            chartHTML += `
                <div class="chart-bar">
                    <div class="chart-label">${rating}점</div>
                    <div class="chart-progress">
                        <div class="chart-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="chart-count">${count}</div>
                </div>
            `;
        }
        
        this.resultChart.innerHTML = chartHTML;
    }
    
    restartSurvey() {
        this.resultsContainer.style.display = 'none';
        this.surveyContainer.style.display = 'block';
        this.startSurvey();
    }


    exportResults() {
        const results = {
            totalQuestions: this.totalQuestions,
            responses: this.responses,
            averageScore: (this.responses.reduce((sum, r) => sum + r.rating, 0) / this.responses.length).toFixed(1),
            totalTime: new Date() - this.startTime,
            ratingDistribution: this.calculateRatingDistribution(),
            completedAt: new Date().toISOString()
        };
        
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
    
    window.exportResults = () => surveyApp.exportResults();
});

// 문장 말고 단어로 진행 -> 명사10, 형용사10, 동사10, 문화맥락단어10 4종류 있음
// 명사 형용사 동사는 일반단어로 묶을 예정.

// 의미 파악이 쉬워졌다, 문화적 맥락을 표현했다, 표현력이 좋다 3가지 슬라이더로 평가하게.
// 일반 단어 / 문화적 맥락 단어로 2세션 구성한 설문으로 수정하십쇼
// 일반 단어 세션은 슬라이더 2개. 의미, 표현력 평가
// 문화적 맥락 단어 세션은 슬라이더 3개. 의미, 문화적 맥락, 표현력 평가

// 답변 결과는 json으로 저장할 수 있어야 함. 1인당 1개의 json 파일로 저장...

// 처음에 인적사항 입력란 필요.

/*
json 데이터 구조 예시
{
    "participantName": "김철수",
    "age": 25,
    "answers": [
        {
            "sessionType": "일반 단어",
            "responses": [
                {
                    "word": "사과",
                    "meaningRating": 4,
                    "expressionRating": 5
                },
                {
                    "word": "사랑",
                    "meaningRating": 5,
                    "expressionRating": 5
                }
                //이하생략...
            ]
        },
        {
            "sessionType": "문화적 맥락 단어",
            "responses": [
                {
                    "word": "김치",
                    "meaningRating": 5,
                    "culturalContextRating": 5,
                    "expressionRating": 4
                },
                {
                    "word": "한복",
                    "meaningRating": 4,
                    "culturalContextRating": 5,
                    "expressionRating": 5
                }
                //이하생략...
            ]
        }
    ]
}
*/