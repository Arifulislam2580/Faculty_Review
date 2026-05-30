// Teacher Data
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

let selectedTeacherId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    populateTeacherSelect();
    setupStarRatings();
    setupFormSubmission();
});

// Populate teacher select dropdown
function populateTeacherSelect() {
    const select = document.getElementById('teacherSelect');
    
    teachersData.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.id;
        option.textContent = teacher.name;
        select.appendChild(option);
    });

    select.addEventListener('change', function() {
        selectedTeacherId = this.value;
        updateCourseSelect();
        updateCourseInfo();
    });
}

// Update course select based on selected teacher
function updateCourseSelect() {
    const courseSelect = document.getElementById('courseSelect');
    courseSelect.innerHTML = '<option value="">-- Select Course --</option>';

    if (selectedTeacherId) {
        const teacher = teachersData.find(t => t.id == selectedTeacherId);
        if (teacher) {
            teacher.courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
        }
    }
}

// Update course info display
function updateCourseInfo() {
    const courseInfo = document.getElementById('courseInfo');
    if (selectedTeacherId) {
        const teacher = teachersData.find(t => t.id == selectedTeacherId);
        if (teacher) {
            courseInfo.textContent = `Faculty Code: ${teacher.code}`;
        }
    }
}

// Setup star rating functionality
function setupStarRatings() {
    document.querySelectorAll('.star-rating').forEach(rating => {
        const field = rating.dataset.field;
        const stars = rating.querySelectorAll('.star');

        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = this.dataset.value;
                document.getElementById(field).value = value;

                // Update visual state
                stars.forEach(s => {
                    if (s.dataset.value <= value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            // Hover effect
            star.addEventListener('mouseenter', function() {
                const value = this.dataset.value;
                stars.forEach(s => {
                    if (s.dataset.value <= value) {
                        s.style.color = 'var(--warning-color)';
                    } else {
                        s.style.color = '';
                    }
                });
            });
        });

        rating.addEventListener('mouseleave', function() {
            const field = rating.dataset.field;
            const selectedValue = document.getElementById(field).value;
            stars.forEach(s => {
                if (selectedValue && s.dataset.value <= selectedValue) {
                    s.style.color = 'var(--warning-color)';
                } else {
                    s.style.color = '';
                }
            });
        });
    });
}

// Setup form submission
function setupFormSubmission() {
    const form = document.getElementById('reviewForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all ratings are provided
        const teachingQuality = document.getElementById('teachingQuality').value;
        const behavior = document.getElementById('behavior').value;
        const marking = document.getElementById('marking').value;
        const communication = document.getElementById('communication').value;
        const enthusiasm = document.getElementById('enthusiasm').value;

        if (!teachingQuality || !behavior || !marking || !communication || !enthusiasm) {
            showError('Please rate all categories before submitting.');
            return;
        }

        // Get form data
        const teacherId = document.getElementById('teacherSelect').value;
        const course = document.getElementById('courseSelect').value;
        const comments = document.getElementById('comments').value;

        if (!teacherId || !course) {
            showError('Please select a teacher and course.');
            return;
        }

        // Create review object
        const review = {
            id: Date.now(),
            teacherId: teacherId,
            teacherName: teachersData.find(t => t.id == teacherId).name,
            course: course,
            ratings: {
                teachingQuality: parseInt(teachingQuality),
                behavior: parseInt(behavior),
                marking: parseInt(marking),
                communication: parseInt(communication),
                enthusiasm: parseInt(enthusiasm)
            },
            comments: comments,
            timestamp: new Date().toLocaleString(),
            date: new Date().toISOString()
        };

        // Save to localStorage
        let reviews = JSON.parse(localStorage.getItem('teacherReviews')) || [];
        reviews.push(review);
        localStorage.setItem('teacherReviews', JSON.stringify(reviews));

        // Show success message
        showSuccess();

        // Reset form
        form.reset();
        document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
        document.querySelectorAll('input[type="hidden"]').forEach(input => input.value = 0);
        document.getElementById('courseSelect').innerHTML = '<option value="">-- Select Course --</option>';
        document.getElementById('courseInfo').textContent = '';

        // Hide message after 3 seconds
        setTimeout(() => {
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.style.display = 'none';
            }
        }, 3000);
    });
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess() {
    const successDiv = document.getElementById('successMessage');
    successDiv.style.display = 'block';
}

// Helper function to convert rating to stars
function getRatingStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
