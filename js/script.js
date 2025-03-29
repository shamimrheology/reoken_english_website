// script.js

document.addEventListener('DOMContentLoaded', () => {
    /* ===========================
       Carousel Functionality
    =========================== */
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to show the current slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    // Show next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Show previous slide
    function prevSlideFunc() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Event listeners for carousel controls
    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlideFunc);
    }

    // Auto-slide every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause auto-slide on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseover', () => {
            clearInterval(slideInterval);
        });
        carousel.addEventListener('mouseout', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }

    /* ===========================
       Hamburger Menu Toggle
    =========================== */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');

    if (hamburger && navMenu) {
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            const expanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
            hamburger.setAttribute('aria-expanded', !expanded);
        };

        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

    /* ===========================
       Dynamic News Feed (Home Page)
    =========================== */
    const newsContainer = document.getElementById('news-container');
    const loadMoreBtn = document.getElementById('load-more');
    let newsPage = 1;
    const newsPerPage = 3;
    let allNewsItems = [];

    // **Add the 'news-items' class to the news container for column-wise layout**
    if (newsContainer) {
        newsContainer.classList.add('news-items');
    }

    // Function to fetch and parse news.html
    async function fetchNews() {
        try {
            const response = await fetch('news.html');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newsHtml = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(newsHtml, 'text/html');
            const newsElements = doc.querySelectorAll('.latest-news .news-item');

            newsElements.forEach(item => {
                const titleElement = item.querySelector('h3');
                const descriptionElement = item.querySelector('p');
                const imageElement = item.querySelector('img');
                const readMoreLinkElement = item.querySelector('.read-more');

                const title = titleElement ? titleElement.textContent.trim() : 'No Title';
                const description = descriptionElement ? descriptionElement.textContent.trim() : 'No Description';
                const imageSrc = imageElement ? imageElement.getAttribute('src') : '';
                const imageSrcset = imageElement ? imageElement.getAttribute('srcset') : '';
                const imageSizes = imageElement ? imageElement.getAttribute('sizes') : '';
                const imageAlt = imageElement ? imageElement.getAttribute('alt') : '';
                const readMore = readMoreLinkElement ? readMoreLinkElement.getAttribute('href') : '#';

                allNewsItems.push({
                    title,
                    description,
                    imageSrc,
                    imageSrcset,
                    imageSizes,
                    imageAlt,
                    readMore
                });
            });

            loadNews(); // Load the first set of news items
        } catch (error) {
            console.error('Error fetching news:', error);
            if (newsContainer) {
                newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
            }
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // Function to load news items into the DOM
    function loadNews() {
        const start = (newsPage - 1) * newsPerPage;
        const end = start + newsPerPage;
        const newsToLoad = allNewsItems.slice(start, end);

        newsToLoad.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            // Create a picture element for better control over responsive images
            const picture = document.createElement('picture');

            // Create source elements based on srcset and sizes
            if (news.imageSrcset && news.imageSizes) {
                const source = document.createElement('source');
                source.setAttribute('srcset', news.imageSrcset);
                source.setAttribute('sizes', news.imageSizes);
                // Optionally, set type if using different image formats (e.g., WebP)
                // source.setAttribute('type', 'image/webp');
                picture.appendChild(source);
            }

            // Create the img element with src, alt, and loading attributes
            const img = document.createElement('img');
            img.src = news.imageSrc;
            img.alt = news.imageAlt;
            img.loading = 'lazy';

            // Append the img to the picture element
            picture.appendChild(img);

            // Assemble the news item
            newsItem.appendChild(picture);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('news-content');

            const h3 = document.createElement('h3');
            h3.textContent = news.title;

            const p = document.createElement('p');
            p.textContent = news.description;

            const readMore = document.createElement('a');
            readMore.href = news.readMore;
            readMore.classList.add('read-more');
            readMore.textContent = 'Read More';

            contentDiv.appendChild(h3);
            contentDiv.appendChild(p);
            contentDiv.appendChild(readMore);

            newsItem.appendChild(contentDiv);

            newsContainer.appendChild(newsItem);
        });

        // Hide Load More button if no more news
        if (end >= allNewsItems.length) {
            loadMoreBtn.style.display = 'none';
        }

        newsPage++;
    }

    // Initial fetch of news
    if (newsContainer && loadMoreBtn) {
        fetchNews();

        // Load more news on button click
        loadMoreBtn.addEventListener('click', loadNews);
    }

    /* ===========================
       Interactive Charts (Research Areas Page)
    =========================== */
    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        // Check if the current page is research.html
        if (window.location.pathname.endsWith('research.html')) {
            // Initialize Genomics Chart
            const genomicsCtx = document.getElementById('genomicsChart').getContext('2d');
            const genomicsChart = new Chart(genomicsCtx, {
                type: 'bar',
                data: {
                    labels: ['RNASeq', 'Transcriptomics', 'Mutation Analysis'],
                    datasets: [{
                        label: 'Genomics Projects',
                        data: [15, 10, 8],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: { 
                        y: { 
                            beginAtZero: true 
                        } 
                    }
                }
            });

            // Initialize Lipidomics Chart
            const lipidomicsCtx = document.getElementById('lipidomicsChart').getContext('2d');
            const lipidomicsChart = new Chart(lipidomicsCtx, {
                type: 'pie',
                data: {
                    labels: ['Plasmalogens in AD', 'Plasmalogens in PD', 'Plasmalogens in Aging'],
                    datasets: [{
                        label: 'Lipidomics Studies',
                        data: [30, 20, 50],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                }
            });

            // Initialize Therapeutic Compound Synthesis Chart
            const therapeuticCtx = document.getElementById('therapeuticChart').getContext('2d');
            const therapeuticChart = new Chart(therapeuticCtx, {
                type: 'line',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [{
                        label: 'Compound Synthesis Progress',
                        data: [20, 40, 60, 80],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    scales: { 
                        y: { 
                            beginAtZero: true 
                        } 
                    }
                }
            });

            // Initialize Plasmalogen Research Chart
            const plasmalogenCtx = document.getElementById('plasmalogenChart').getContext('2d');
            const plasmalogenChart = new Chart(plasmalogenCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Neuroinflammation', 'Diabetes', 'Immune Function', 'Signaling'],
                    datasets: [{
                        label: 'Plasmalogen Applications',
                        data: [25, 25, 25, 25],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                }
            });
        }
    }

    /* ===========================
       Modal Functionality (News & Achievements Page)
    =========================== */
    // Check if the current page is news.html
    if (window.location.pathname.endsWith('news.html')) {
        // Modal functionality
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeButton = document.querySelector('.close-button');

        // Function to open modal
        function openModal(title, body) {
            modalTitle.textContent = title;
            modalBody.textContent = body;
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
        }

        // Function to close modal
        function closeModal() {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }

        // Event listener for close button
        if (closeButton) {
            closeButton.addEventListener('click', closeModal);
        }

        // Event listener for clicks outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                closeModal();
            }
        });

        // Add event listeners to all "Read More" and "Details" links
        const readMoreLinks = document.querySelectorAll('.read-more');
        readMoreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Example content - replace with actual news details
                const newsItem = e.target.closest('.news-item');
                const title = newsItem.querySelector('h3').textContent;
                const body = newsItem.querySelector('p').textContent;
                openModal(title, body);
            });
        });

        const eventDetailsLinks = document.querySelectorAll('.event-details');
        eventDetailsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Example content - replace with actual event details
                const eventItem = e.target.closest('.event-item');
                const title = eventItem.querySelector('h3').textContent;
                const body = `Detailed information about ${title} will be available soon.`;
                openModal(title, body);
            });
        });
    }

    /* ===========================
       Newsletter Subscription (All Pages)
    =========================== */
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.email.value;
            // Implement actual subscription logic here (e.g., API call)
            alert(`Thank you for subscribing with ${email}!`);
            newsletterForm.reset();
        });
    }

    /* ===========================
       Collaboration Form Submission (Collaborations Page)
    =========================== */
    // Check if the current page is collaborations.html
    if (window.location.pathname.endsWith('collaborations.html')) {
        const collaborationForm = document.getElementById('collaboration-form');
        if (collaborationForm) {
            collaborationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = collaborationForm.name.value;
                const email = collaborationForm.email.value;
                const organization = collaborationForm.organization.value;
                const researchArea = collaborationForm.research_area.value;
                const message = collaborationForm.message.value;

                // For demonstration, we'll just display an alert.
                // In a real application, you would send this data to a server.
                alert(`Thank you, ${name}, for your interest in collaborating!\n\nDetails:\nOrganization: ${organization}\nResearch Area: ${researchArea}\nMessage: ${message}`);

                // Reset the form
                collaborationForm.reset();
            });
        }
    }

    /* ===========================
       Contact Form Submission (Contact Us Page) - EmailJS Integration
    =========================== */
    // Check if the current page is contact.html
    if (window.location.pathname.endsWith('contact.html')) {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Define the recipients
                const recipients = ['mshossain2@yahoo.com', 'shamim@rheology.po-jp.com'];

                // Gather form data
                const formData = new FormData(this);
                const userName = formData.get('user_name');
                const userEmail = formData.get('user_email');
                const subject = formData.get('subject');
                const message = formData.get('message');

                // Function to send email to a single recipient
                function sendEmail(toEmail) {
                    const templateParams = {
                        to_email: toEmail,
                        user_name: userName,
                        user_email: userEmail,
                        subject: subject,
                        message: message
                    };

                    return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
                }

                // Send emails to all recipients
                Promise.all(recipients.map(email => sendEmail(email)))
                    .then(() => {
                        alert('Message sent successfully to all recipients!');
                        contactForm.reset();
                    })
                    .catch(error => {
                        alert('Failed to send the message. Please try again later.');
                        console.error('EmailJS Error:', error);
                    });
            });
        }
    }
});
