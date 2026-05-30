const teachersData = [
    { id: 1, name: "Dr. Md. Afzal Hossain", code: "CBA_DAH", courses: ["ACC 101", "ACC 300"] },
    { id: 2, name: "Mr. Hasan Moudud", code: "CBA_MHM", courses: ["ACC 101"] },
    { id: 3, name: "Ms. Taslima Khatun", code: "CBA_MTK", courses: ["ACC 101", "ACC 303"] },
    { id: 4, name: "Sunan Islam", code: "CBA_SI", courses: ["ACC 101", "ACC 1305", "ACC 201", "ACC 40"] },
    { id: 5, name: "Ashish Basak", code: "CBA_AB", courses: ["ACC 1305", "ACC 304", "ACC 403"] },
    { id: 6, name: "Mr. Abdullah Al Yousuf Khan", code: "CBA_AYK", courses: ["ACC 1305"] },
    { id: 7, name: "Dr. Md. Moniruzzaman", code: "CBA_DMM", courses: ["ACC 300", "ACC 303"] },
    { id: 8, name: "Mr. Swapan Kumar Saha", code: "CBA_SS", courses: ["ACC 304", "ACC 404"] }
];

let allReviews = [];
let filteredReviews = [];

document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    populateFilters();
    filterReviews();
});

function loadReviews() {
    allReviews = JSON.parse(localStorage.getItem('teacherReviews')) || [];
}

function populateFilters() {
    const teacherFilter = document.getElementById('teacherFilter');
    const courseFilter = document.getElementById('courseFilter');

    // Populate teacher filter
    teachersData.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        teacherFilter.appendChild(option);
    });

    // Populate course filter with all unique courses
    const allCourses = [...new Set(teachersData.flatMap(t => t.courses))];
    allCourses.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        courseFilter.appendChild(option);
    });
}

function filterReviews() {
    const teacherFilter = document.getElementById('teacherFilter').value;
    const courseFilter = document.getElementById('courseFilter').value;

    filteredReviews = allReviews.filter(review => {
        const matchTeacher = !teacherFilter || review.teacherId == teacherFilter;
        const matchCourse = !courseFilter || review.course === courseFilter;
        return matchTeacher && matchCourse;
    });

    displayReviews();
}

function sortReviews() {
    // Sort by average rating (highest first)
    filteredReviews.sort((a, b) => {
        const avgA = getAverageRating(a.ratings);
        const avgB = getAverageRating(b.ratings);
        return avgB - avgA;
    });

    displayReviews();
}

function displayReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');

    if (filteredReviews.length === 0) {
        reviewsList.innerHTML = '';
        noReviews.style.display = 'block';
        return;
    }

    noReviews.style.display = 'none';
    reviewsList.innerHTML = '';

    filteredReviews.forEach(review => {
        const avgRating = getAverageRating(review.ratings);
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="teacher-name">${review.teacherName}</div>
                    <span class="course-badge">${review.course}</span>
                </div>
            </div>

            <div class="rating-display">
                <div class="rating-item">
                    <div class="rating-item-label">Teaching Quality</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.teachingQuality)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${review.ratings.teachingQuality}/5</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Behavior</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.behavior)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${review.ratings.behavior}/5</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Fair Marking</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.marking)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${review.ratings.marking}/5</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Communication</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.communication)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${review.ratings.communication}/5</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Enthusiasm</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.enthusiasm)}</div>
                    <div style="font-size: 0.85rem; color: var(--text-light);">${review.ratings.enthusiasm}/5</div>
                </div>
            </div>

            <div style="text-align: center; padding: 1rem; background: rgba(52, 152, 219, 0.1); border-radius: 6px; margin: 1rem 0;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color);">
                    ${avgRating.toFixed(1)} / 5.0
                </div>
                <div style="color: var(--text-light); font-size: 0.9rem;">Overall Rating</div>
            </div>

            ${review.comments ? `<div class="review-comment">${escapeHtml(review.comments)}</div>` : ''}

            <div class="review-meta">
                📅 ${review.timestamp}
            </div>
        `;
        reviewsList.appendChild(card);
    });
}

function getAverageRating(ratings) {
    const sum = ratings.teachingQuality + ratings.behavior + ratings.marking + ratings.communication + ratings.enthusiasm;
    return sum / 5;
}

function getRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
