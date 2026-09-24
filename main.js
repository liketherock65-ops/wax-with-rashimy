(function () {
  "use strict";

  /* Sticky nav background on scroll */
  var nav = document.getElementById("siteNav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu toggle */
  var toggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var isOpen = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Scroll reveal (single subtle pass, respects reduced motion) */
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!prefersReduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Lightbox for gallery */
  var lightbox = document.getElementById("lightbox");
  var lightboxContent = document.getElementById("lightboxContent");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(html) {
    lightboxContent.innerHTML = html;
    lightbox.classList.add("is-open");
    lightboxClose.focus();
    var vid = lightboxContent.querySelector("video");
    if (vid) { vid.controls = true; vid.muted = false; vid.play().catch(function(){}); }
  }
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightboxContent.innerHTML = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    function activate() {
      if (item.dataset.lightbox === "video") {
        openLightbox('<video src="assets/video/showcase.mp4" playsinline></video>');
      } else {
        var label = item.dataset.lightboxText || "Photo";
        openLightbox('<div style="background:#fff;color:#211a15;padding:60px 40px;border-radius:4px;font-family:Jost,sans-serif;text-align:center;max-width:360px;">' + label + ' — replace this placeholder with a real photo.</div>');
      }
    }
    item.addEventListener("click", activate);
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });

  /* Booking form -> WhatsApp deep link (no backend) */
  var form = document.getElementById("bookingForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var service = form.service.value;
    var date = form.date.value;
    var time = form.time.value;
    var message = form.message.value.trim();

    var lines = ["Hello Wax with Rashimy, I would like to book an appointment."];
    if (name) lines.push("Name: " + name);
    if (phone) lines.push("Phone: " + phone);
    if (service) lines.push("Service: " + service);
    if (date) lines.push("Preferred date: " + date);
    if (time) lines.push("Preferred time: " + time);
    if (message) lines.push("Message: " + message);

    var text = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/256758627594?text=" + text, "_blank", "noopener");
  });
})();
