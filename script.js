
        let currentSection = 'hero';
        let currentLanguage = 'all';

        function isAuthenticated() {
            try {
                return Boolean(JSON.parse(localStorage.getItem('sih_user')));
            } catch (_) {
                return false;
            }
        }

        function showSection(section) {
            const requiresAuth = ['dashboard', 'challenges', 'leaderboard', 'profile'];
            if (requiresAuth.includes(section) && !isAuthenticated()) {
                window.location.href = 'login.html';
                return;
            }
            document.getElementById(currentSection).classList.add('hidden');
            document.getElementById(section).classList.remove('hidden');
            currentSection = section;
        }

        function showChallenges(subject) {
            showSection('challenges');
            // Filter challenges based on subject
            console.log(`Showing challenges for: ${subject}`);
        }

        function filterChallenges(difficulty, evt) {
            const buttons = document.querySelectorAll('.tab-button');
            const challenges = document.querySelectorAll('.challenge-item');

            if (evt) {
                const group = evt.target.parentElement;
                group.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                evt.target.classList.add('active');
                // persist difficulty group selection
                if (group && group.getAttribute('aria-label') === 'Filter Challenges by Difficulty') {
                    localStorage.setItem('sih_filter_difficulty', difficulty);
                }
            } else {
                buttons.forEach(btn => btn.classList.remove('active'));
            }

            challenges.forEach(challenge => {
                const matchesDifficulty = (difficulty === 'all' || challenge.dataset.difficulty === difficulty);
                const matchesLanguage = (currentLanguage === 'all' || challenge.dataset.language === currentLanguage);
                challenge.style.display = (matchesDifficulty && matchesLanguage) ? 'block' : 'none';
            });
        }

        function filterByLanguage(language, evt) {
            currentLanguage = language;
            if (evt) {
                const group = evt.target.parentElement;
                group.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                evt.target.classList.add('active');
                // persist language selection
                localStorage.setItem('sih_filter_language', language);
            }
            // Re-apply difficulty filter with current selection
            const activeDifficultyBtn = document.querySelector('[aria-label="Filter Challenges by Difficulty"] .tab-button.active');
            const difficulty = activeDifficultyBtn ? activeDifficultyBtn.textContent.toLowerCase() : 'all';
            filterChallenges(difficulty);
        }

        // Simple problem registry
        const problemRegistry = {
            'fizzbuzz-rev': {
                title: 'FizzBuzz Revisited',
                difficulty: 'easy',
                language: 'javascript',
                desc: 'Print numbers 1..n, but replace multiples of 3/5 with words. Classic.',
                template: 'function fizzbuzz(n) {\n  // TODO: implement\n}\n'
            },
            'two-sum-hm': {
                title: 'Two Sum (hashmap)',
                difficulty: 'medium',
                language: 'python',
                desc: 'Find two indices such that nums[i] + nums[j] == target using a hashmap.',
                template: 'def two_sum(nums, target):\n    # hashmap approach\n    return []\n'
            },
            'lis-nlogn': {
                title: 'LIS in O(n log n)',
                difficulty: 'hard',
                language: 'cpp',
                desc: 'Compute LIS length using patience sorting (binary search).',
                template: '#include <bits/stdc++.h>\nusing namespace std;\nint lengthOfLIS(vector<int>& nums){\n  return 0;\n}\n'
            }
        };

        function navigateToProblem(id) {
            window.location.hash = `#/problem/${id}`;
        }

        function toggleHint() {
            const hint = document.getElementById('pd-hint');
            const btn = document.getElementById('hintBtn');
            if (!hint || !btn) return;
            const isHidden = hint.classList.toggle('hidden');
            btn.textContent = isHidden ? 'Show hint' : 'Hide hint';
        }

        function showProblemDetail(id) {
            const data = problemRegistry[id];
            if (!data) return;
            const diffMap = { easy: 'background:#d1fae5;color:#065f46;', medium: 'background:#fef3c7;color:#92400e;', hard: 'background:#fee2e2;color:#991b1b;' };
            document.getElementById(currentSection).classList.add('hidden');
            document.getElementById('problem-detail').classList.remove('hidden');
            currentSection = 'problem-detail';
            const title = document.getElementById('pd-title');
            const desc = document.getElementById('pd-desc');
            const code = document.getElementById('pd-code');
            const lang = document.getElementById('pd-lang');
            const diff = document.getElementById('pd-diff');
            if (title) title.textContent = data.title;
            if (desc) desc.textContent = data.desc;
            if (code) code.value = data.template;
            if (lang) lang.textContent = data.language.toUpperCase();
            if (diff) { diff.textContent = data.difficulty; diff.setAttribute('style', diffMap[data.difficulty] || ''); }
        }

        function handleHashChange() {
            const hash = window.location.hash;
            if (hash.startsWith('#/problem/')) {
                const id = hash.split('/')[2];
                showProblemDetail(id);
            } else if (hash === '#/challenges') {
                showSection('challenges');
            }
        }

        function runCode(editorId) {
            const code = document.getElementById(editorId).value;
            const resultDiv = document.getElementById('result1');
            
            // Simulate code execution
            setTimeout(() => {
                resultDiv.style.display = 'block';
                resultDiv.innerHTML = '<strong>Test Results:</strong> <span style="color: #10b981;">✓ All tests passed! Great solution!</span>';
            }, 1500);
        }

        function checkBalance(evt) {
            const target = evt ? evt.target : event.target;
            const input = target.previousElementSibling.querySelector('input');
            const answer = input.value.trim();
            
            if (answer === '2,1,2') {
                input.style.borderColor = '#10b981';
                input.style.backgroundColor = '#d1fae5';
                alert('Correct! The balanced equation is: 2H₂ + O₂ → 2H₂O');
            } else {
                input.style.borderColor = '#ef4444';
                input.style.backgroundColor = '#fee2e2';
                alert('Not quite right. Think about conservation of atoms!');
            }
        }

        // Initialize with hero section, wire events, auth, and nav
        document.addEventListener('DOMContentLoaded', () => {
            // Console calling card (because why not)
            
            try { console.log('%cSTEM Academy dev build', 'color:#93c5fd;font-weight:bold;font-size:13px'); } catch(e) {}
            showSection('hero');

            // Initialize progress ring (quick + dirty; it's fine)
            const ring = document.querySelector('.progress-ring .ring-fg');
            const container = document.querySelector('.progress-ring');
            if (ring && container) {
                const pct = Number(container.getAttribute('data-progress') || '70');
                const circumference = 2 * Math.PI * 52;
                ring.style.strokeDasharray = String(circumference);
                ring.style.strokeDashoffset = String(circumference * (1 - pct / 100));
            }

            // Mobile nav toggle
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', () => {
                    const isOpen = navLinks.classList.toggle('open');
                    navToggle.setAttribute('aria-expanded', String(isOpen));
                });
            }

            // Replace inline onclicks for difficulty buttons (progressive enhancement)
            document.querySelectorAll('[aria-label="Filter Challenges by Difficulty"] .tab-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const text = btn.textContent.toLowerCase();
                    const value = ['all','easy','medium','hard'].includes(text) ? text : 'all';
                    filterChallenges(value, e);
                });
            });

            // Language filters
            document.querySelectorAll('[aria-label="Filter Challenges by Language"] .tab-button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const langMap = { 'all languages': 'all', 'python': 'python', 'javascript': 'javascript', 'c++': 'cpp' };
                    const key = btn.textContent.trim().toLowerCase();
                    filterByLanguage(langMap[key] || 'all', e);
                });
            });

            // Hydrate persisted filters
            const savedLang = localStorage.getItem('sih_filter_language');
            const savedDiff = localStorage.getItem('sih_filter_difficulty');
            if (savedLang) {
                const btn = Array.from(document.querySelectorAll('[aria-label="Filter Challenges by Language"] .tab-button'))
                  .find(b => b.textContent.trim().toLowerCase() === (savedLang === 'all' ? 'all languages' : savedLang));
                btn && btn.click();
            }
            if (savedDiff) {
                const btn = Array.from(document.querySelectorAll('[aria-label="Filter Challenges by Difficulty"] .tab-button'))
                  .find(b => b.textContent.trim().toLowerCase() === savedDiff);
                btn && btn.click();
            }

            // Auth state
            hydrateAuthUI();

            // Auth and toggles
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const kidModeToggle = document.getElementById('kidModeToggle');
            logoutBtn && logoutBtn.addEventListener('click', () => logout());

            // Kid Mode toggle
            applyKidModeFromStorage();
            kidModeToggle && kidModeToggle.addEventListener('click', () => {
                const root = document.documentElement;
                const enabled = root.classList.toggle('kid-mode');
                localStorage.setItem('sih_kid_mode', enabled ? '1' : '0');
            });

            // Hash routing
            window.addEventListener('hashchange', handleHashChange);
            handleHashChange();

            // Sidebar toggle persistence (demo: show hints checkbox)
            const hintsCheckbox = Array.from(document.querySelectorAll('.challenge-sidebar input[type="checkbox"]')).find(x => x.parentElement && x.parentElement.textContent.toLowerCase().includes('show hints'));
            if (hintsCheckbox) {
                const saved = localStorage.getItem('sih_sidebar_show_hints');
                if (saved !== null) hintsCheckbox.checked = saved === '1';
                hintsCheckbox.addEventListener('change', () => {
                    localStorage.setItem('sih_sidebar_show_hints', hintsCheckbox.checked ? '1' : '0');
                });
            }

            // XP persistence demo: allow manual override for testing
            const xpEl = document.querySelector('#dashboard .stat-card:nth-child(4) .stat-number');
            const savedXp = localStorage.getItem('sih_user_xp');
            if (xpEl && savedXp) {
                xpEl.textContent = Number(savedXp).toLocaleString();
                hydrateAuthUI();
            }
        });

        // Add some interactive animations
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Mini polyfill-ish quirk (old habits): forEach on NodeList in very old browsers
        if (!NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function(cb, thisArg) {
                for (var i = 0; i < this.length; i++) cb.call(thisArg || this, this[i], i, this)
            }
        }

        // (Removed modal-based login helpers)

        function logout() {
            localStorage.removeItem('sih_user');
            hydrateAuthUI();
        }

        function hydrateAuthUI() {
            const userRaw = localStorage.getItem('sih_user');
            const user = userRaw ? JSON.parse(userRaw) : null;
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            const profileTitle = document.querySelector('#profile h2');
            const xpEl = document.querySelector('#dashboard .stat-card:nth-child(4) .stat-number');
            const badgeEl = document.querySelector('.rank-badge');
            const nextMsg = document.querySelector('#dashboard .stats-grid + .stats-grid div:nth-child(2) div:nth-child(2)');
            if (user) {
                loginBtn && loginBtn.classList.add('hidden');
                logoutBtn && logoutBtn.classList.remove('hidden');
                if (profileTitle) profileTitle.textContent = `👤 ${user.name}`;
            } else {
                loginBtn && loginBtn.classList.remove('hidden');
                logoutBtn && logoutBtn.classList.add('hidden');
                if (profileTitle) profileTitle.textContent = '👤 Your Profile';
            }

            // Kyu-style rank ladder from XP (quick heuristic)
            const xp = (xpEl && Number((xpEl.textContent || '').replace(/[^0-9]/g, ''))) || 0;
            const tiers = [
                { name: 'Novice I', min: 0 },
                { name: 'Novice II', min: 300 },
                { name: 'Apprentice I', min: 800 },
                { name: 'Apprentice II', min: 1200 },
                { name: 'Apprentice III', min: 1500 },
                { name: 'Journeyman I', min: 2000 },
                { name: 'Journeyman II', min: 2600 },
                { name: 'Adept I', min: 3200 }
            ];
            let current = tiers[0];
            for (let i=0;i<tiers.length;i++) { if (xp >= tiers[i].min) current = tiers[i]; }
            const next = tiers.find(t => t.min > current.min);
            if (badgeEl) badgeEl.textContent = `Rank • ${current.name}`;
            if (next && nextMsg) nextMsg.textContent = `~${Math.max(0, next.min - xp)} XP to reach ${next.name}`;
        }

        function applyKidModeFromStorage() {
            const value = localStorage.getItem('sih_kid_mode');
            if (value === '1') {
                document.documentElement.classList.add('kid-mode');
            }
        }

        // TODO(A): extract filters to a tiny module if this grows more
