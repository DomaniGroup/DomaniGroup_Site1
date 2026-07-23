(() => {
  "use strict";

  const shell = document.getElementById("siteShell");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const mainNav = document.getElementById("mainNav");
  let selectedService = "AC repair";
  let quoteIndex = 0;
  let quoteDone = false;
  let quoteAnswers = {};
  let reviewSource = "All";
  let reviewService = "All";

  const quoteQuestions = [
    { key: "system", label: "What needs attention?", options: ["AC / cooling", "Heat pump", "Furnace", "Water heater"] },
    { key: "home", label: "What is the home size?", options: ["Under 1,500 sq ft", "1,500–2,500 sq ft", "2,500+ sq ft"] },
    { key: "age", label: "How old is the equipment?", options: ["0–5 years", "6–12 years", "13+ years"] },
    { key: "urgency", label: "When do you need help?", options: ["Today", "This week", "Planning ahead"] },
    { key: "ownership", label: "Do you own the home?", options: ["Yes, I own it", "I rent", "I manage a property"] },
    { key: "finance", label: "Would monthly payments help?", options: ["Show financing", "I’ll pay upfront"] },
  ];

  const templates = {
    booking: () => `
      <form class="modal-booking" id="modalBookingForm">
        <div class="modal-form-note"><span class="live-dot"></span> Same-day availability · no payment required</div>
        <label>Service<select name="service"><option>${selectedService}</option><option>AC repair</option><option>AC replacement</option><option>Heat pump service</option><option>Mini splits</option><option>Maintenance plans</option><option>Emergency service</option></select></label>
        <div class="form-grid"><label>Date<input type="date" name="date" value="2026-07-24"></label><label>Time window<select name="time"><option>8:00–10:00 AM</option><option>11:00 AM–1:00 PM</option><option>2:00–4:00 PM</option><option>5:00–7:00 PM</option></select></label></div>
        <label>What’s going on?<textarea name="issue" rows="3" placeholder="A little context helps us arrive prepared..."></textarea></label>
        <label class="upload-field"><span>▧ Upload pictures <small>(optional)</small></span><input type="file" accept="image/*" multiple><small>Show us the thermostat, unit, or leak</small></label>
        <button class="button button-orange button-full" type="submit">Request this time →</button>
      </form>`,
    ai: () => `
      <div class="modal-ai"><div class="modal-chat" id="modalChat"><div class="modal-chat-row"><span class="chat-ai">✦</span><p>Hi — I’m Northstar’s AI receptionist. I can answer questions, price common services, or find a time for a technician.</p></div></div><div class="modal-quick-prompts"><button data-ai-prompt="Why is my AC freezing?">Why is my AC freezing?</button><button data-ai-prompt="How much is an AC tune-up?">Price a tune-up</button><button data-ai-prompt="I need an emergency tonight">I need help now</button></div><div class="modal-chat-input"><input id="aiInput" placeholder="Ask anything about your home comfort..."><button id="aiSend" aria-label="Send message">→</button></div><p class="modal-note">☎ Need a person? Call (407) 555-0198 anytime.</p></div>`,
    customer: () => `
      <div class="modal-dashboard"><div class="modal-dashboard-welcome"><div class="dash-avatar">JS</div><div><span>Signed in as</span><strong>Joe Sysko</strong></div><span class="dashboard-secure">▣ Secure</span></div><div class="modal-dash-list"><div><span class="dash-list-icon blue">▣</span><span><strong>AC tune-up</strong><small>Fri, Jul 24 · 2:00–4:00 PM</small></span><b>Confirmed</b></div><div><span class="dash-list-icon mint">❝</span><span><strong>Invoices</strong><small>No open balance · last paid Jul 03</small></span><b>Paid</b></div><div><span class="dash-list-icon orange">◇</span><span><strong>Comfort Club</strong><small>Next tune-up due Sep 2026</small></span><b>Active</b></div><div><span class="dash-list-icon purple">⌂</span><span><strong>Carrier Infinity · 2021</strong><small>Warranty active · 4 years remaining</small></span><b>View</b></div></div><div class="maintenance-reminder">▣<span><strong>Next reminder · Aug 18</strong><small>Time to change your filter</small></span><button data-modal="booking" data-service="Maintenance plans">Schedule</button></div><button class="button button-navy button-full" data-modal="booking" data-service="Maintenance plans">Book your next visit →</button></div>`,
    owner: () => `
      <div class="modal-owner-dashboard"><div class="owner-modal-header"><span class="owner-modal-brand"><span class="brand-mark">✦</span> northstar <small>OWNER DASHBOARD</small></span><span class="owner-modal-chip"><span class="live-dot"></span> Business intelligence</span></div><div class="owner-modal-subhead"><div><span>OPERATING PICTURE · LAST 30 DAYS</span><strong>Good morning, operator.</strong></div><span class="owner-modal-period">May 01 — May 30⌄</span></div><div class="owner-modal-kpis"><div><span>New leads</span><strong>184</strong><small class="owner-positive">↑ 18.6%</small></div><div><span>Close rate</span><strong>42.8%</strong><small class="owner-positive">↑ 4.2%</small></div><div><span>Revenue</span><strong>$214k</strong><small class="owner-positive">↑ 12.4%</small></div><div><span>Avg. ticket</span><strong>$1,164</strong><small class="owner-negative">↓ 2.1%</small></div></div><div class="owner-modal-content-grid"><div class="owner-modal-chart"><div class="owner-modal-chart-top"><strong>Revenue by service</strong><span>Compare performance →</span></div><div class="owner-modal-bars"><span style="height:43%"><i>AC</i></span><span style="height:66%"><i>REP</i></span><span style="height:53%"><i>CLUB</i></span><span style="height:84%"><i>COMM</i></span><span style="height:61%"><i>AIR</i></span><span style="height:74%"><i>HEAT</i></span></div></div><div class="owner-modal-list"><div class="owner-modal-list-title"><strong>What needs attention</strong><span>3 signals</span></div><div><span class="owner-signal signal-orange">ϟ</span><span><strong>Lead response time</strong><small>Improve by 8 min to lift close rate</small></span><b>Action</b></div><div><span class="owner-signal signal-mint">◇</span><span><strong>Maintenance renewal</strong><small>78.4% · up 6.2% this month</small></span><b>Healthy</b></div><div><span class="owner-signal signal-purple">▰</span><span><strong>Technician utilization</strong><small>Marco’s route has 2 open windows</small></span><b>View</b></div></div></div><div class="owner-modal-feature-strip"><span>⌕ Google rankings</span><span>⌂ Job heat map</span><span>◉ Revenue by tech</span><span>✓ Callback rate</span></div><button class="button button-orange button-full" data-close-modal>See the full owner dashboard section →</button></div>`,
    financing: () => `<div class="modal-financing"><div class="modal-offer"><span>Current promotion</span><strong>0% APR for 18 months</strong><small>on qualifying purchases</small></div><div class="modal-payment-big"><span>Example monthly payment</span><strong id="modalPayment">$128<small>/mo</small></strong><p>Based on a $6,800 project over 60 months. Your actual terms depend on approval.</p></div><button class="button button-orange button-full" data-finance-submit>Start prequalification →</button><p class="modal-note">▣ Checking options uses a soft credit inquiry.</p></div>`,
    membership: () => `<div class="modal-membership"><div class="membership-price"><span>Comfort Club</span><strong>$19<small>/month</small></strong><span>cancel anytime</span></div><div class="modal-check-list"><span>✓ Annual AC and heat maintenance</span><span>✓ Priority scheduling during peak season</span><span>✓ 15% off repairs and parts</span><span>✓ Extended labor warranty</span><span>✓ Automatic seasonal reminders</span></div><button class="button button-navy button-full" data-membership-submit>Join Comfort Club →</button></div>`,
    tracking: () => `<div class="modal-tracking"><div class="mini-map"><span class="map-label label-one">WINTER PARK</span><span class="map-label label-two">LAKE EOLA</span><span class="map-pin home-pin">⌂</span><span class="map-pin truck-pin">▰</span><span class="map-route-dot dot-one"></span><span class="map-route-dot dot-two"></span><span class="map-route-dot dot-three"></span></div><div class="modal-track-status"><div class="tech-avatar avatar-marco">MA</div><div><span class="live-text"><span class="live-dot"></span> Live ETA</span><strong>Marco is 12 minutes away</strong><small>Heading north on Corrine Dr. · Van 24</small></div><a href="tel:14075550198" class="round-icon-button">☎</a></div><div class="tracking-actions"><button class="button button-outline" data-modal="ai">◌ Message dispatch</button><button class="button button-orange" data-modal="booking">Book another visit →</button></div></div>`,
    team: () => `<div class="modal-team"><div class="modal-team-grid"><div class="modal-team-person"><div class="modal-team-photo" style="background-image:url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85')"><span>MA</span></div><strong>Marco Alvarez</strong><span>Lead comfort advisor</span><small>14 years · Diagnostics · heat pumps</small><div class="mini-review"><span class="stars">★★★★★</span> “Explains everything.”</div></div><div class="modal-team-person"><div class="modal-team-photo" style="background-image:url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85')"><span>AC</span></div><strong>Alyssa Chen</strong><span>Service technician</span><small>9 years · Mini splits · IAQ</small><div class="mini-review"><span class="stars">★★★★★</span> “So thoughtful.”</div></div><div class="modal-team-person"><div class="modal-team-photo" style="background-image:url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=85')"><span>DW</span></div><strong>Derek Williams</strong><span>Install manager</span><small>18 years · Commercial design</small><div class="mini-review"><span class="stars">★★★★★</span> “Great work.”</div></div></div><div class="modal-team-footer"><span>◇ Every tech is licensed, insured, and background-checked.</span><button class="button button-orange" data-modal="booking">Book with Northstar →</button></div></div>`,
    career: () => `<div class="modal-career"><div class="career-open-role"><span class="role-status">Hiring now</span><strong>HVAC Service Technician</strong><small>Orlando · Full time · $28–$42/hr</small><button data-modal="booking">Apply for this role →</button></div><div class="career-open-role"><span class="role-status role-apprentice">Apprenticeship</span><strong>HVAC Apprentice</strong><small>Central Florida · Paid training · $18–$24/hr</small><button data-modal="booking">Start an application →</button></div><div class="career-foot"><span>✓ Benefits from day one</span><span>✓ Paid certifications</span><span>✓ Upload résumé online</span></div></div>`,
  };

  const modalMeta = {
    booking: ["Online scheduling", "Let’s get you comfortable."],
    ai: ["24/7 digital front desk", "How can I help?"],
    customer: ["Customer portal preview", "Your comfort, in one place."],
    owner: ["OWNER DASHBOARD PREVIEW", "Run the business by the numbers."],
    financing: ["Comfort, on your terms", "See your financing options."],
    membership: ["Recurring peace of mind", "Make comfort the easy part."],
    tracking: ["Live visit tracker", "Marco is 12 minutes away."],
    team: ["People behind the work", "Good people do great work."],
    career: ["Join the Northstar team", "Build a career with momentum."],
  };

  function scrollToId(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    if (mainNav) mainNav.classList.remove("main-nav-open");
  }

  function openModal(type, service) {
    if (service) selectedService = service;
    const meta = modalMeta[type] || modalMeta.booking;
    modalEyebrow.textContent = meta[0];
    modalTitle.textContent = meta[1];
    modalContent.innerHTML = (templates[type] || templates.booking)();
    modalBackdrop.classList.add("is-open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    bindModalContent(type);
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  function bindModalContent(type) {
    if (type === "booking") {
      const form = document.getElementById("modalBookingForm");
      form?.addEventListener("submit", (event) => {
        event.preventDefault();
        modalContent.innerHTML = `<div class="booking-success"><div class="result-check">✓</div><p class="eyebrow">REQUEST RECEIVED</p><h3>We’ll see you soon.</h3><p>We texted a confirmation to your phone. You can manage the visit from your customer dashboard.</p><button class="button button-navy" data-modal="customer">Open customer dashboard →</button></div>`;
      });
    }
    if (type === "ai") bindAi();
    if (type === "financing") document.querySelector("[data-finance-submit]")?.addEventListener("click", (event) => { event.currentTarget.outerHTML = `<div class="inline-success">✓ Your prequalification request is started.</div>`; });
    if (type === "membership") document.querySelector("[data-membership-submit]")?.addEventListener("click", (event) => { event.currentTarget.outerHTML = `<div class="inline-success">✓ You’re on the Comfort Club list. We’ll follow up shortly.</div>`; });
  }

  function bindAi() {
    const input = document.getElementById("aiInput");
    const chat = document.getElementById("modalChat");
    const respond = (message) => {
      const clean = message.trim();
      if (!clean) return;
      const lower = clean.toLowerCase();
      let response = "I can help with that. I can price a common service, find an appointment, or connect you with our team.";
      if (lower.includes("freeze") || lower.includes("frozen")) response = "A frozen AC usually points to restricted airflow, low refrigerant, or a coil issue. Turn the system off and set the fan to ON while we send help. An AC diagnostic starts at $89.";
      if (lower.includes("price") || lower.includes("cost") || lower.includes("quote")) response = "A standard AC diagnostic starts at $89. Tune-ups start at $129, and a typical replacement ranges from $6,800–$12,400 depending on size and efficiency.";
      if (lower.includes("emergency") || lower.includes("tonight") || lower.includes("now")) response = "We’re open now. I can reserve the next emergency window, or call a live dispatcher at (407) 555-0198. Is there smoke, gas smell, or active water?";
      if (lower.includes("finance") || lower.includes("monthly")) response = "Yes — approved customers can choose promotional financing. A $6,800 project is about $128/month over 60 months in this demo.";
      chat.insertAdjacentHTML("beforeend", `<div class="modal-chat-row modal-chat-user"><span class="chat-person">You</span><p>${escapeHtml(clean)}</p></div><div class="modal-chat-row"><span class="chat-ai">✦</span><p>${response}</p></div>`);
      chat.scrollTop = chat.scrollHeight;
      input.value = "";
    };
    document.getElementById("aiSend")?.addEventListener("click", () => respond(input.value));
    input?.addEventListener("keydown", (event) => { if (event.key === "Enter") respond(input.value); });
    document.querySelectorAll("[data-ai-prompt]").forEach((button) => button.addEventListener("click", () => respond(button.dataset.aiPrompt || "")));
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  function renderQuote() {
    const container = document.getElementById("quote-engine");
    if (!container) return;
    if (quoteDone) {
      container.innerHTML = `<div class="card-topline"><span class="card-number">01</span><span class="card-label">Instant quote engine</span><span class="card-time">✓ Complete</span></div><div class="quote-result"><div class="result-check">✓</div><p class="eyebrow">YOUR ESTIMATE IS READY</p><h3>Plan for <span>$6,800–$12,400</span></h3><p>Based on your ${escapeHtml((quoteAnswers.system || "equipment").toLowerCase())} answers, a properly sized system should take about 1 day to install. You may qualify for up to $2,400 in local and federal rebates.</p><div class="result-breakdown"><div><span>Monthly payment</span><strong>From $128/mo</strong></div><div><span>Install time</span><strong>1 day</strong></div><div><span>Next opening</span><strong>Tomorrow</strong></div></div><div class="result-actions"><button class="button button-orange" data-modal="booking" data-service="AC replacement">Book an in-home estimate →</button><button class="button button-ghost" data-action="reset-quote">Start over</button></div></div>`;
      return;
    }
    const question = quoteQuestions[quoteIndex];
    container.innerHTML = `<div class="card-topline"><span class="card-number">01</span><span class="card-label">Instant quote engine</span><span class="card-time">◷ 2 min</span></div><div class="estimator-intro"><p class="eyebrow">ANSWER 6 QUICK QUESTIONS</p><h3>Get a useful number<br>before you talk to anyone.</h3><p>No email or phone required. See price range, timeline, rebates, and monthly options.</p></div><div class="quote-progress"><span>Question ${quoteIndex + 1} of ${quoteQuestions.length}</span><div><span style="width:${((quoteIndex + 1) / quoteQuestions.length) * 100}%"></span></div></div><div class="quote-question"><span class="question-count">0${quoteIndex + 1}</span><div><h4>${question.label}</h4><div class="quote-options">${question.options.map((option) => `<button data-quote-option="${escapeHtml(option)}">${escapeHtml(option)} <span>→</span></button>`).join("")}</div></div></div><div class="quote-footnote">▣ Your answers stay private · no spam, ever</div>`;
  }

  function filterReviews() {
    const query = (document.getElementById("reviewSearch")?.value || "").toLowerCase();
    document.querySelectorAll("#reviewGrid .review-card").forEach((card) => {
      const sourceMatch = reviewSource === "All" || card.dataset.source === reviewSource;
      const serviceMatch = reviewService === "All" || card.dataset.service === reviewService;
      const queryMatch = !query || (card.dataset.search || "").toLowerCase().includes(query);
      card.classList.toggle("is-hidden", !(sourceMatch && serviceMatch && queryMatch));
    });
  }

  function updateFinance(value) {
    const amount = Number(value);
    const monthly = Math.round(amount / 60 + 14);
    const amountLabel = `$${amount.toLocaleString()}`;
    const number = document.getElementById("paymentNumber");
    const estimate = document.getElementById("estimateNumber");
    if (number) number.textContent = `$${monthly}`;
    if (estimate) estimate.textContent = amountLabel;
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    const scrollTarget = target.dataset.scroll;
    if (scrollTarget) { event.preventDefault(); scrollToId(scrollTarget); return; }
    const modalTarget = target.dataset.modal;
    if (modalTarget) { event.preventDefault(); openModal(modalTarget, target.dataset.service); return; }
    if (target.dataset.closeModal !== undefined) { closeModal(); scrollToId("owners"); return; }
    if (target.dataset.action === "toggle-emergency") {
      event.preventDefault();
      const enabled = shell.classList.toggle("emergency-mode");
      document.getElementById("openStatus").textContent = enabled ? "We’re available 24/7" : "Open now";
      document.getElementById("statusMessage").textContent = enabled ? "Priority dispatch is active" : "Same-day appointments in Orlando";
      document.getElementById("emergencyActionText").textContent = enabled ? "Exit emergency mode" : "Try emergency mode";
      return;
    }
    if (target.dataset.action === "toggle-menu") { mainNav.classList.toggle("main-nav-open"); return; }
    if (target.dataset.action === "start-quote") { quoteIndex = 0; quoteDone = false; quoteAnswers = {}; renderQuote(); scrollToId("estimator"); return; }
    if (target.dataset.action === "reset-quote") { quoteIndex = 0; quoteDone = false; quoteAnswers = {}; renderQuote(); return; }
    if (target.dataset.quoteOption) {
      const question = quoteQuestions[quoteIndex];
      quoteAnswers[question.key] = target.dataset.quoteOption;
      if (quoteIndex === quoteQuestions.length - 1) quoteDone = true; else quoteIndex += 1;
      renderQuote();
      return;
    }
    if (target.classList.contains("time-options") || target.closest(".time-options")) {
      const button = target.closest(".time-options")?.querySelectorAll("button");
      button?.forEach((item) => item.classList.remove("time-option-selected"));
      target.classList.add("time-option-selected");
    }
    if (target.dataset.reviewSource) {
      reviewSource = target.dataset.reviewSource;
      document.querySelectorAll("[data-review-source]").forEach((button) => button.classList.toggle("source-active", button.dataset.reviewSource === reviewSource));
      filterReviews();
    }
    if (target.dataset.reviewService) {
      reviewService = target.dataset.reviewService;
      document.querySelectorAll("[data-review-service]").forEach((button) => button.classList.toggle("service-filter-active", button.dataset.reviewService === reviewService));
      filterReviews();
    }
  });

  document.getElementById("modalClose")?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("mousedown", (event) => { if (event.target === modalBackdrop) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  document.getElementById("bookingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.innerHTML = `<div class="booking-success"><div class="result-check">✓</div><p class="eyebrow">YOU’RE ON THE LIST</p><h3>We saved your request.</h3><p>A confirmation is headed to your phone now. We’ll text you when a technician is assigned.</p><div class="confirmation-card"><span>Preferred window</span><strong>Fri, Jul 24 · 2:00–4:00 PM</strong><span>Service</span><strong>AC repair</strong></div><button type="button" class="button button-outline" data-modal="booking">Make another request</button></div>`;
  });
  document.getElementById("financeSlider")?.addEventListener("input", (event) => updateFinance(event.target.value));
  document.getElementById("reviewSearch")?.addEventListener("input", filterReviews);
  renderQuote();
})();
