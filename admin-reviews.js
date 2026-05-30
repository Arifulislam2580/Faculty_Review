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
    updateStatistics();
    displayTeacherStats();
    displayReviews();
});

function loadReviews() {
    allReviews = JSON.parse(localStorage.getItem('teacherReviews')) || [];
}

function populateFilters() {
    const teacherFilter = document.getElementById('teacherFilter');
    const courseFilter = document.getElementById('courseFilter');

    // Clear existing options except first
    while (teacherFilter.options.length > 1) {
        teacherFilter.remove(1);
    }
    while (courseFilter.options.length > 1) {
        courseFilter.remove(1);
    }

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

function updateStatistics() {
    const totalReviews = allReviews.length;
    const uniqueTeachers = new Set(allReviews.map(r => r.teacherId)).size;
    
    let averageRating = 0;
    if (totalReviews > 0) {
        const sumRatings = allReviews.reduce((sum, review) => {
            const avg = (review.ratings.teachingQuality + review.ratings.behavior + 
                         review.ratings.marking + review.ratings.communication + 
                         review.ratings.enthusiasm) / 5;
            return sum + avg;
        }, 0);
        averageRating = (sumRatings / totalReviews).toFixed(1);
    }

    document.getElementById('totalReviews').textContent = totalReviews;
    document.getElementById('totalTeachers').textContent = uniqueTeachers;
    document.getElementById('averageRating').textContent = averageRating;
}

function displayTeacherStats() {
    const statsDiv = document.getElementById('teacherStats');
    
    // Group reviews by teacher
    const teacherReviews = {};
    allReviews.forEach(review => {
        if (!teacherReviews[review.teacherId]) {
            teacherReviews[review.teacherId] = [];
        }
        teacherReviews[review.teacherId].push(review);
    });

    let statsHtml = '';
    
    teachersData.forEach(teacher => {
        const reviews = teacherReviews[teacher.id] || [];
        if (reviews.length > 0) {
            const avgRating = calculateTeacherAverage(reviews);
            statsHtml += `
                <div style="padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${teacher.name}</strong>
                        <div style="font-size: 0.85rem; color: var(--text-light);">
                            Courses: ${teacher.courses.join(', ')}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.3rem; font-weight: bold; color: var(--secondary-color);">${avgRating.toFixed(1)} / 5.0</div>
                        <div style="font-size: 0.85rem; color: var(--text-light);">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            `;
        }
    });

    if (statsHtml === '') {
        statsHtml = '<p style="color: var(--text-light);">No reviews yet.</p>';
    }

    statsDiv.innerHTML = statsHtml;
}

function calculateTeacherAverage(reviews) {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => {
        const avg = (review.ratings.teachingQuality + review.ratings.behavior + 
                     review.ratings.marking + review.ratings.communication + 
                     review.ratings.enthusiasm) / 5;
        return total + avg;
    }, 0);
    return sum / reviews.length;
}

function displayReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const noReviews = document.getElementById('noReviews');

    // Show filtered or all reviews
    const displayReviews = filteredReviews.length > 0 ? filteredReviews : allReviews;

    if (displayReviews.length === 0) {
        reviewsList.innerHTML = '';
        noReviews.style.display = 'block';
        return;
    }

    noReviews.style.display = 'none';
    reviewsList.innerHTML = '';

    displayReviews.forEach(review => {
        const avgRating = (review.ratings.teachingQuality + review.ratings.behavior + 
                          review.ratings.marking + review.ratings.communication + 
                          review.ratings.enthusiasm) / 5;
        
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="teacher-name">${review.teacherName}</div>
                    <span class="course-badge">${review.course}</span>
                </div>
                <button class="btn-delete" onclick="deleteReview(${review.id})">Delete</button>
            </div>

            <div class="rating-display">
                <div class="rating-item">
                    <div class="rating-item-label">Teaching Quality</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.teachingQuality)}</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Behavior</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.behavior)}</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Fair Marking</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.marking)}</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Communication</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.communication)}</div>
                </div>
                <div class="rating-item">
                    <div class="rating-item-label">Enthusiasm</div>
                    <div class="rating-stars">${getRatingStars(review.ratings.enthusiasm)}</div>
                </div>
            </div>

            <div style="text-align: center; padding: 1rem; background: rgba(52, 152, 219, 0.1); border-radius: 6px; margin: 1rem 0;">
                <div style="font-size: 1.3rem; font-weight: bold; color: var(--secondary-color);">
                    ${avgRating.toFixed(1)} / 5.0
                </div>
            </div>

            ${review.comments ? `<div class="review-comment"><strong>Comment:</strong> ${escapeHtml(review.comments)}</div>` : ''}

            <div class="review-meta">
                📅 ${review.timestamp}
            </div>
        `;
        reviewsList.appendChild(card);
    });
}

function getRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        allReviews = allReviews.filter(r => r.id !== reviewId);
        localStorage.setItem('teacherReviews', JSON.stringify(allReviews));
        
        // Reload data
        loadReviews();
        updateStatistics();
        displayTeacherStats();
        filterReviews();
    }
}

function clearAllReviews() {
    if (confirm('⚠️ This will permanently delete ALL reviews. Are you sure?')) {
        if (confirm('This action cannot be undone. Click OK to confirm.')) {
            localStorage.setItem('teacherReviews', JSON.stringify([]));
            allReviews = [];
            filteredReviews = [];
            updateStatistics();
            displayTeacherStats();
            displayReviews();
            alert('All reviews have been cleared.');
        }
    }
}

function exportReviews() {
    if (allReviews.length === 0) {
        alert('No reviews to export.');
        return;
    }

    // Create CSV header
    let csv = 'Teacher Name,Course,Teaching Quality,Behavior,Fair Marking,Communication,Enthusiasm,Average Rating,Comments,Date\n';

    // Add review data
    allReviews.forEach(review => {
        const avgRating = ((review.ratings.teachingQuality + review.ratings.behavior + 
                           review.ratings.marking + review.ratings.communication + 
                           review.ratings.enthusiasm) / 5).toFixed(2);
        
        const comments = review.comments ? `"${review.comments.replace(/"/g, '""')}"` : '';
        
        csv += `"${review.teacherName}","${review.course}",${review.ratings.teachingQuality},${review.ratings.behavior},${review.ratings.marking},${review.ratings.communication},${review.ratings.enthusiasm},${avgRating},${comments},"${review.timestamp}"\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher-reviews-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Initial load
filterReviews();
