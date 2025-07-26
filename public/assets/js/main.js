/**
* Template Name: Medicio
* Template URL: https://bootstrapmade.com/medicio-free-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  $(() => {
    $.ajax({
      url: "/images/carousel/getAllCarouselImages",
      method: "GET",
      success: function (slides) {
        const $wrapper = $("#carousel-wrapper");
        const $indicators = $("#carousel-indicators");

        $wrapper.empty(); 
        $indicators.empty();

        // Inject slides dynamically
        $.each(slides, function (index, slide) {
          const activeClass = index === 0 ? "active" : "";

          $wrapper.append(`
            <div class="carousel-item ${activeClass}">
              <img src="${slide.url}" class="d-block w-100" alt="${slide.name}" />
              <div class="container">
                <h2>${slide.name || "Welcome to Our Hospital"}</h2>
                <p>${slide.description || "Quality care for every patient"}</p>
                <a href="#about" class="btn-get-started">Read More</a>
              </div>
            </div>
          `);
        });

        // ✅ AFTER slides are injected, generate indicators with your working logic
        generateCarouselIndicators();

        // ✅ Initialize Bootstrap carousel
        const heroCarousel = document.querySelector("#hero-carousel");
        if (heroCarousel) {
          new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: "carousel"
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("❌ Failed to load carousel images:", error);
      }
    });
  });

  // ✅ Your existing indicator generator
  function generateCarouselIndicators() {
    document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
      const carousel = carouselIndicator.closest('.carousel');
      const carouselId = carousel.id;

      // Clear old indicators before regenerating
      carouselIndicator.innerHTML = "";

      carousel.querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
        if (index === 0) {
          carouselIndicator.innerHTML += `<li data-bs-target="#${carouselId}" data-bs-slide-to="${index}" class="active"></li>`;
        } else {
          carouselIndicator.innerHTML += `<li data-bs-target="#${carouselId}" data-bs-slide-to="${index}"></li>`;
        }
      });
    });
  }


  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();







  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);








  // Now for the gallery slider
  $(() => {
    $.getJSON("/images/gallery/getAllGalleryImages", function (images) {
      if (images.length > 0) {
        let slidesHtml = "";

        images.forEach((img) => {
          // Adjust if your API uses a different field for URL
          const imageUrl = img.url || `/gallery/${img.name}`;

          slidesHtml += `
            <div class="swiper-slide">
              <a class="glightbox" data-gallery="images-gallery" href="${imageUrl}">
                <img src="${imageUrl}" class="img-fluid" alt="${img.name || ''}">
              </a>
            </div>`;
        });

        $("#gallery-wrapper").html(slidesHtml);

        // ✅ Init Swiper after content is injected
        const swiper = new Swiper(".gallery-swiper", {
          loop: true,
          speed: 600,
          autoplay: { delay: 5000 },
          slidesPerView: "auto",
          centeredSlides: true,
          pagination: {
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
          },
          breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          },
        });

        // ✅ Init Lightbox after injection
        if (typeof GLightbox !== "undefined") {
          GLightbox({ selector: ".glightbox" });
        }
      } else {
        $("#gallery-wrapper").html("<p>No images found.</p>");
      }
    }).fail(function (err) {
      console.error("Failed to load gallery images:", err);
      $("#gallery-wrapper").html("<p>Error loading images.</p>");
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();











// Home page JavaScript codes
$(() => {
  // Get all doctors for home page but first check if the element is in the page needed by id.
  if ($('#homeDoctorList').length) {
    fetchDoctorsHome();
  }

  function fetchDoctorsHome() {
    $.get('/departments/doctors/getAllDoctors').done((data) => {
      const { departments } = data;
      const container = $('#homeDoctorList');
      container.empty();

      departments.forEach(cat => {
        cat.doctors.forEach(doc => {
          const html = `
            <div class="doctor-card team-member doctor-clickable" 
                data-aos="fade-up"
                data-id="${doc._id}"
                data-department="${cat._id}"
                data-department-name="${cat.name}">
                
              <div class="member-img">
                <img src="${doc.profilePic || '/dashboard-assets/images/profile/user-3.jpg'}" alt="${doc.name}">
                <div class="social">
                  <a href="#"><i class="bi bi-twitter-x"></i></a>
                  <a href="#"><i class="bi bi-facebook"></i></a>
                  <a href="#"><i class="bi bi-instagram"></i></a>
                  <a href="#"><i class="bi bi-linkedin"></i></a>
                </div>
              </div>
              
              <div class="member-info">
                <h4>${doc.name}</h4>
                <span>${cat.name}</span>
              </div>
            </div>
          `;
          container.append(html);
        });
      });

      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }).fail(() => {
      $('#homeDoctorList').html('<p class="text-danger">Failed to load doctors.</p>');
    });

    // ✅ Scroll behavior
    const sliderWrapper = document.querySelector('.doctor-slider-wrapper');
    const sliderContainer = document.querySelector('#homeDoctorList');

    // Dynamically calculate card width (including gap)
    function getCardStep() {
      const firstCard = document.querySelector('.doctor-card');
      if (!firstCard) return 300;
      const style = getComputedStyle(firstCard);
      return firstCard.offsetWidth + parseInt(style.marginRight || 20);
    }

    document.getElementById('nextDoctor').addEventListener('click', () => {
      sliderWrapper.scrollBy({ left: getCardStep(), behavior: 'smooth' });
    });

    document.getElementById('prevDoctor').addEventListener('click', () => {
      sliderWrapper.scrollBy({ left: -getCardStep(), behavior: 'smooth' });
    });

  }



  // Navigate to a doctor's profile page
  $(document).on('click', '.doctor-clickable', function (e) {
    // Ignore clicks on social icons
    if ($(e.target).closest('.social a').length > 0) return;

    const doctorId = $(this).data('id');
    const departmentId = $(this).data('department');

    // Redirect to doctor profile page
    window.location.href = `/doctor-profile?dept=${encodeURIComponent(departmentId)}&doc=${encodeURIComponent(doctorId)}`;
  });





  // Fetch doctors from the returned departments in the ejs
  $('#department').on('change', function () {
    const selectedOption = $(this).find('option:selected');
    const doctors = selectedOption.data('doctors') || [];

    const $doctorSelect = $('#doctor');
    $doctorSelect.empty();
    $doctorSelect.append('<option value="">Select Doctor</option>');

    doctors.forEach(doc => {
      $doctorSelect.append(`<option value="${doc.name}">${doc.name}</option>`);
    });
  });



  
  // Book an appointment form submission
  $('#appointmentForm').submit(function (e) {
    e.preventDefault();
    const $form = $(this);

    const formData = {
      name: $form.find('[name="name"]').val().trim(),
      email: $form.find('[name="email"]').val().trim(),
      phone: $form.find('[name="phone"]').val().trim(),
      dateAndTimeBooked: $form.find('[name="date"]').val(),
      department: $form.find('[name="department"]').val(),
      doctor: $form.find('[name="doctor"]').val(),
      subject: `Appointment with Dr. ${$form.find('[name="doctor"]').val()} in ${$form.find('[name="department"]').val()}`,
      message: $form.find('[name="message"]').val().trim()
    };

    $form.find('.loading').show();
    $form.find('.error-message, .sent-message').hide();

    // ✅ Show loading spinner before AJAX request
    Swal.fire({
      title: 'Booking Appointment...',
      text: 'Please wait ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // shows spinner
      }
    });

    $.ajax({
      url: '/appointments/book',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function (res) {
        $form.find('.loading').hide();
        Swal.fire('Success!', 'Appointment booked successfully.', 'success');
        $form[0].reset();
      },
      error: function (xhr) {
        $form.find('.loading').hide();
        const message = xhr.responseJSON?.message || 'Something went wrong!';
        Swal.fire('Error', message, 'error');
      }
    });
  });









  // Doctors profile page JavaScript codes
  if (window.location.pathname === '/doctor-profile') {

    function getQueryParam(param) {
      return new URLSearchParams(window.location.search).get(param);
    }

    const deptId = getQueryParam('dept');
    const docId = getQueryParam('doc');

    function fetchDoctorProfile(deptId, docId) {
      // Show loading spinner/text
      $('#doctorName').text('Loading...');
      $('#doctorDepartment').text('Loading...');
      $('#doctorEmail').text('Loading...');
      $('#doctorPhone').text('Loading...');
      $('#doctorImage').attr('src', '/dashboard-assets/images/profile/user-3.jpg');

      $.get(`/departments/${deptId}/doctors/${docId}`)
        .done((doctor) => {
          console.log(doctor)
          $('#doctorImage').attr('src', doctor.profilePic || '/dashboard-assets/images/profile/user-3.jpg');
          $('#doctorName').text(doctor.name);
          $('#doctorDepartment').text(`Department: ${doctor.departmentName}` || 'N/A');
          $('#doctorEmail').text(doctor.email || 'N/A');
          $('#doctorPhone').text(doctor.phone || 'N/A');
        })
        .fail((xhr) => {
          $('#doctorDetailsContainer').html(
            `<p class="text-danger text-center">
              ${xhr.responseJSON?.message || 'Failed to load doctor details.'}
            </p>`
          );
        });
    }

    $(document).ready(() => {
      if (deptId && docId) {
        fetchDoctorProfile(deptId, docId);
      } else {
        $('#doctorDetailsContainer').html('<p class="text-danger text-center">Invalid doctor details</p>');
      }
    });

  }









  // The Blog/Latest news section
  let currentSlide = 0;

  function renderNews(blogs) {
    const newsContainer = document.getElementById('newsContainer');
    if (!blogs.length) {
      newsContainer.innerHTML = '<div class="text-muted text-center">No news available.</div>';
      return;
    }

    newsContainer.innerHTML = blogs.map((blog, index) => {
      const date = new Date(blog.createdAt || Date.now()).toLocaleDateString();
      return `
        <div class="news-item" data-aos="fade-up" data-aos-delay="${100 + index * 100}">
          <div class="news-box border p-3 bg-light rounded shadow-sm h-100">
            <img src="${blog.image || '/assets/img/news/default.jpg'}" alt="News Image">
            <h6 class="mt-4 fw-bold">${blog.title.length > 40 ? blog.title.substring(0, 40) + '...' : blog.title}</h6>
            <small class="text-muted">${date}</small>
            <p class="mt-2">${blog.message.substring(0, 50)}...</p>
            <a href="/blog-details?id=${blog._id}" class="btn btn-sm btn-primary mt-2" data-id="${blog._id}">Read More</a>
          </div>
        </div>
      `;
    }).join('');

    // Reset slide on render
    currentSlide = 0;
    $('#newsContainer').css('transform', 'translateX(0)');
  }

  function slideNews(direction) {
    const container = document.getElementById('newsContainer');
    const items = container.children;
    const totalItems = items.length;
    const visibleItems = window.innerWidth < 576 ? 1 : window.innerWidth < 992 ? 2 : 4;

    // Protect against overflow
    currentSlide = Math.min(
      Math.max(currentSlide + direction, 0),
      Math.max(totalItems - visibleItems, 0)
    );

    const slideWidth = items[0]?.offsetWidth + 20; // include gap
    container.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  }

  // Attach buttons globally (you can put this outside if not re-rendered often)
  window.slideNews = slideNews;

  // AJAX load blogs
  $.ajax({
    url: '/blog/latestNews',
    method: 'GET',
    success: function (blogs) {
      renderNews(blogs);
    },
    error: function (err) {
      console.error('News fetch error:', err);
      $('#newsContainer').html('<div class="text-danger text-center">Error loading news.</div>');
    }
  });






  // Fetch and view single blog's details
  if (window.location.pathname === '/blog-details') {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Access',
        text: 'No blog ID provided.',
      });
      return;
    }

    // 🔁 Fetch and Render Blog
    function loadBlogDetails(blogId) {
      $.ajax({
        url: '/blog/getSingleBlog/' + blogId,
        method: 'GET',
        success: function (blog) {
          const createdAt = new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          });

          let commentsHtml = '';
          if (blog.comments?.length) {
            commentsHtml = `<h4 class="comments-count">${blog.comments.length} Comment${blog.comments.length > 1 ? 's' : ''}</h4>`;
            blog.comments.forEach((c, i) => {
              const date = new Date(c.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              });
              commentsHtml += `
                <div id="comment-${i}" class="comment mb-4 p-3 border rounded shadow-sm bg-white">
                  <div class="d-flex align-items-start gap-3">
                    <div class="comment-img">
                      <img src="/assets/img/testimonials/testimonials-1.jpg" alt="User" class="rounded-circle" width="50" height="50">
                    </div>
                    <div class="flex-grow-1">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="mb-0 fw-semibold text-dark">${c.name}</h6>
                        <small class="text-muted"><i class="bi bi-clock me-1"></i>${date}</small>
                      </div>
                      <p class="text-muted mb-2" style="font-size: 0.95rem;">${c.comment}</p>
                      <a href="#" class="reply text-primary small"><i class="bi bi-reply-fill me-1"></i>Reply</a>
                    </div>
                  </div>
                </div>
              `;
            });
          }

          const html = `
            <div class="col-12 mx-auto mb-5">
              <article class="entry entry-single border rounded shadow-sm bg-white p-4">
                <div class="entry-img mb-4 text-center">
                  <img src="${blog.image || '/assets/img/blog/blog-1.jpg'}" alt="Blog Image" class="img-fluid rounded w-100" style="max-height: 400px; object-fit: cover;">
                </div>

                <h2 class="entry-title mb-3 fw-bold text-dark">${blog.title}</h2>

                <div class="entry-meta mb-3 text-muted small">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item me-3"><i class="bi bi-person me-1"></i> Admin</li>
                    <li class="list-inline-item me-3"><i class="bi bi-clock me-1"></i><time datetime="${blog.createdAt}">${createdAt}</time></li>
                    <li class="list-inline-item"><i class="bi bi-chat-dots me-1"></i> ${blog.comments?.length || 0} Comments</li>
                  </ul>
                </div>

                <div class="entry-content text-dark" style="line-height: 1.7; font-size: 1rem;">
                  <p>${blog.message}</p>
                </div>
              </article>
            </div>

              <div class="blog-comments mt-5">
                ${commentsHtml || '<p class="text-muted">No comments yet.</p>'}

                <div class="reply-form mt-4">
                  <h4>Leave a Comment</h4>
                  <form id="commentForm">
                    <div class="row">
                      <div class="col-md-6 form-group">
                        <input name="name" type="text" class="form-control" placeholder="Your Name">
                      </div>
                      <div class="col-md-6 form-group mt-3 mt-md-0">
                        <input name="email" type="email" class="form-control" placeholder="Your Email">
                      </div>
                    </div>
                    <div class="form-group mt-3">
                      <textarea name="comment" class="form-control" rows="5" placeholder="Comment"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Post Comment</button>
                  </form>
                </div>
              </div>
            </div>
          `;

          $('#blogContentWrapper').html(html);
          $('html, body').animate({ scrollTop: $('#blogContentWrapper').offset().top }, 300);
        },
        error: function () {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Unable to load blog details.',
          });
        }
      });
    }

    // Load blog when page loads
    loadBlogDetails(blogId);




    // Handle comment submission
    $(document).on('submit', '#commentForm', function (e) {
      e.preventDefault();

      const name = $(this).find('input[name="name"]').val().trim();
      const email = $(this).find('input[name="email"]').val().trim();
      const comment = $(this).find('textarea[name="comment"]').val().trim();

      if (!name || !email || !comment) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Form',
          text: 'Please fill in all fields before submitting.',
        });
        return;
      }

      $.ajax({
        url: `/blog/${blogId}/addComment`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, comment }),
        success: function () {
          Swal.fire({
            icon: 'success',
            title: 'Comment Posted',
            text: 'Your comment has been successfully added.',
          }).then(() => {
            loadBlogDetails(blogId); // 👈 Refresh content dynamically
          });
        },
        error: function (err) {
          console.error('Error posting comment:', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Unable to post comment. Please try again later.',
          });
        }
      });
    });
  }















  // Contact company via email JavaScript codes
  $('#contactForm').submit(function (e) {
    e.preventDefault();
    const $form = $(this);

    const formData = {
      name: $form.find('[name="name"]').val().trim(),
      email: $form.find('[name="email"]').val().trim(),
      subject: $form.find('[name="subject"]').val().trim(),
      message: $form.find('[name="message"]').val().trim()
    };

    $form.find('.loading').show();
    $form.find('.error-message, .sent-message').hide();

    $.ajax({
      url: '/contact/sendEmailAndSave',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function () {
        $form.find('.loading').hide();
        Swal.fire('Sent!', 'Message delivered successfully.', 'success');
        $form[0].reset();
      },
      error: function (xhr) {
        $form.find('.loading').hide();
        const message = xhr.responseJSON?.message || 'Failed to send message.';
        Swal.fire('Error', message, 'error');
      }
    });
  });










  // Floating Whatsapp icon JavaScript codes
  const phoneNumber = "2347043592391"; // ✅ WhatsApp expects international format (Nigeria = +234)
  
  $("#whatsapp-btn").on("click", function () {
    let message = encodeURIComponent("Hello, I’d like to make an inquiry.");
    
    // ✅ Detect if it's a mobile device
    let isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);

    let whatsappUrl = isMobile 
      ? `https://wa.me/${phoneNumber}?text=${message}`  // Opens WhatsApp mobile app
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`; // Opens WhatsApp Web

    window.open(whatsappUrl, "_blank");
  });


});
