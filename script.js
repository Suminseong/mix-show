// mix-show 리포지토리의 작품(폴더) 목록을 불러와 갤러리로 표시
const GITHUB_USER = "Suminseong";
const GITHUB_REPO = "mix-show";
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;
const PAGES_URL = `https://${GITHUB_USER}.github.io/${GITHUB_REPO}/`;

async function loadGallery() {
    const galleryList = document.querySelector('.gallery-list');
    galleryList.innerHTML = '<div>작품 목록을 불러오는 중...</div>';
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // 폴더(작품)만 필터링
        const folders = data.filter(item => item.type === 'dir');
        if (folders.length === 0) {
            galleryList.innerHTML = '<div>아직 업로드된 작품이 없습니다.</div>';
            return;
        }
        galleryList.innerHTML = '';
        folders.forEach(folder => {
            // 각 폴더의 대표 html 파일로 이동 (ex: /test1/test1.html)
            const folderName = folder.name;
            const pageUrl = `${PAGES_URL}${folderName}/${folderName}.html`;
            const el = document.createElement('div');
            el.className = 'gallery-item';
            el.innerHTML = `
                <div class="gallery-thumb">
                    <span class="gallery-title">${folderName}</span>
                </div>
                <a href="${pageUrl}" target="_blank" class="gallery-link">작품 보기</a>
            `;
            galleryList.appendChild(el);
        });
    } catch (e) {
        galleryList.innerHTML = '<div>작품 목록을 불러오지 못했습니다.</div>';
    }
}

window.addEventListener('DOMContentLoaded', loadGallery);
