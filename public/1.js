// MatchHeader Component in Vanilla JavaScript
class MatchHeader {
    constructor(elementId, options) {
        this.container = document.getElementById(elementId);
        this.match = options.match;
        this.theme = options.theme || 'dark';
        this.onTeamClick = options.onTeamClick || (() => {});
        this.onLeagueClick = options.onLeagueClick || (() => {});
        
        this.leagueLogoError = false;
        this.countdown = '';
        this.matchTime = '';
        this.countdownInterval = null;
        
        this.init();
    }
    
    init() {
        this.render();
        this.setupEventListeners();
        this.startCountdown();
    }
    
    getTeamColors() {
        const colors = this.match.general?.teamColors;
        const fontColors = this.theme === 'dark' 
            ? this.match.general?.fontDarkMode 
            : this.match.general?.fontLightMode;
        
        return {
            homeColor: this.theme === 'dark' 
                ? colors?.darkMode?.home 
                : colors?.lightMode?.home,
            awayColor: this.theme === 'dark' 
                ? colors?.darkMode?.away 
                : colors?.lightMode?.away,
            homeFontColor: fontColors?.home || 'rgba(255, 255, 255, 1.0)',
            awayFontColor: fontColors?.away || 'rgba(255, 255, 255, 1.0)'
        };
    }
    
    isUpcomingMatch() {
        return !this.match.header?.status?.started && !this.match.header?.status?.finished;
    }
    
    getStartTime() {
        return this.match.header?.status?.startDateStr || 
               this.match.header?.status?.utcTime || 
               this.match.header?.status?.startTime ||
               this.match.status?.utcTime ||
               this.match.status?.startTime;
    }
    
    startCountdown() {
        if (!this.isUpcomingMatch()) {
            return;
        }
        
        const startTime = this.getStartTime();
        if (!startTime) {
            return;
        }
        
        const matchDate = new Date(startTime);
        const hours = matchDate.getHours();
        const minutes = matchDate.getMinutes();
        this.matchTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        const calculateCountdown = () => {
            const matchTimeMs = matchDate.getTime();
            const now = new Date().getTime();
            let distance = matchTimeMs - now;
            
            if (distance < 0) {
                this.countdown = 'Starting soon';
                this.updateCountdownDisplay();
                return;
            }
            
            // Calculate time units
            const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365));
            distance -= years * 1000 * 60 * 60 * 24 * 365;
            const months = Math.floor(distance / (1000 * 60 * 60 * 24 * 30.44));
            distance -= months * 1000 * 60 * 60 * 24 * 30.44;
            const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
            distance -= weeks * 1000 * 60 * 60 * 24 * 7;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            distance -= days * 1000 * 60 * 60 * 24;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const parts = [];
            if (years > 0) parts.push(`${years}y`);
            if (months > 0) parts.push(`${months}mo`);
            if (weeks > 0) parts.push(`${weeks}w`);
            if (days > 0) parts.push(`${days}d`);
            if (hours > 0) parts.push(`${hours}h`);
            if (minutes > 0) parts.push(`${minutes}m`);
            if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
            
            this.countdown = parts.join(' ');
            this.updateCountdownDisplay();
        };
        
        calculateCountdown();
        this.countdownInterval = setInterval(calculateCountdown, 1000);
    }
    
    updateCountdownDisplay() {
        const countdownElement = this.container.querySelector('.countdown');
        if (countdownElement) {
            countdownElement.textContent = this.countdown;
        }
    }
    
    render() {
        const colors = this.getTeamColors();
        const homeRedCards = this.match.header?.status?.numberOfHomeRedCards || 0;
        const awayRedCards = this.match.header?.status?.numberOfAwayRedCards || 0;
        const isUpcoming = this.isUpcomingMatch();
        
        const gradientStyle = `linear-gradient(90deg, ${colors.homeColor}, ${colors.awayColor})`;
        
        this.container.className = `match-header ${this.theme}`;
        this.container.innerHTML = `
            
            <!-- Score Section -->
            <div class="score-section" style="background: ${gradientStyle}">
                <div class="teams-container">
                    <!-- Home Team -->
                    <div class="team" data-team-id="${this.match.homeTeam.id}">
                        <div class="team-logo-container">
                            <img src="${this.match.homeTeam.logo}" 
                                 alt="${this.match.homeTeam.name} logo" 
                                 class="team-logo"
                                 onerror="this.src='${this.theme === 'dark' ? 'https://www.fotmob.com/img/team-fallback-dark.png' : 'https://www.fotmob.com/img/team-fallback-light.png'}'">
                            ${homeRedCards > 0 ? `
                                <div class="red-cards home">
                                    ${Array(homeRedCards).fill(0).map(() => `
                                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'%3E%3Crect width='100' height='140' fill='%23dc2626' rx='8'/%3E%3C/svg%3E" 
                                             alt="Red card" 
                                             class="red-card">
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="team-name" style="color: ${colors.homeFontColor}">
                            ${this.match.homeTeam.name}
                        </div>
                    </div>
                    
                    <!-- Score/Time Center -->
                    <div class="score-center">
                        ${isUpcoming ? `
                            <div class="match-time-container" style="color: ${colors.homeFontColor}">
                                <div class="match-time">${this.matchTime || ''}</div>
                                ${this.countdown ? `<div class="countdown">${this.countdown}</div>` : ''}
                            </div>
                        ` : `
                            <div class="score-display">
                                <div class="score" style="color: ${colors.homeFontColor}">
                                    ${this.match.homeTeam.score}
                                </div>
                                <span class="score-divider" style="color: ${colors.homeFontColor}">-</span>
                                <div class="score" style="color: ${colors.awayFontColor}">
                                    ${this.match.awayTeam.score}
                                </div>
                            </div>
                        `}
                        
                        ${this.match.header?.status?.aggregatedStr ? `
                            <div class="aggregate-info" style="
                                color: ${colors.homeFontColor};
                                background-color: ${colors.homeFontColor === 'rgba(255, 255, 255, 1.0)' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
                                border-color: ${colors.homeFontColor}40
                            ">
                                Agg: ${this.match.header.status.aggregatedStr}
                            </div>
                        ` : ''}
                        
                        ${this.match.header?.status?.reason?.penalties ? `
                            <div class="penalty-info" style="
                                color: ${colors.homeFontColor};
                                background-color: ${colors.homeFontColor === 'rgba(255, 255, 255, 1.0)' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'};
                                border-color: ${colors.homeFontColor}40
                            ">
                                Pen: ${this.match.header.status.reason.penalties[0]} - ${this.match.header.status.reason.penalties[1]}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Away Team -->
                    <div class="team" data-team-id="${this.match.awayTeam.id}">
                        <div class="team-logo-container">
                            <img src="${this.match.awayTeam.logo}" 
                                 alt="${this.match.awayTeam.name} logo" 
                                 class="team-logo"
                                 onerror="this.src='${this.theme === 'dark' ? 'https://www.fotmob.com/img/team-fallback-dark.png' : 'https://www.fotmob.com/img/team-fallback-light.png'}'">
                            ${awayRedCards > 0 ? `
                                <div class="red-cards away">
                                    ${Array(awayRedCards).fill(0).map(() => `
                                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'%3E%3Crect width='100' height='140' fill='%23dc2626' rx='8'/%3E%3C/svg%3E" 
                                             alt="Red card" 
                                             class="red-card">
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="team-name" style="color: ${colors.awayFontColor}">
                            ${this.match.awayTeam.name}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- League Info -->
            <div class="league-info ${this.match.general?.parentLeagueId ? 'clickable' : ''}" 
                 ${this.match.general?.parentLeagueId ? `data-league-id="${this.match.general.parentLeagueId}"` : ''}>
                <div class="league-content">
                    ${this.match.general?.parentLeagueId && !this.leagueLogoError ? `
                        <img src="${this.theme === 'dark' 
                            ? `https://images.fotmob.com/image_resources/logo/leaguelogo/dark/${this.match.general.parentLeagueId}.png`
                            : `https://images.fotmob.com/image_resources/logo/leaguelogo/${this.match.general.parentLeagueId}.png`
                        }" 
                             alt="${this.match.league}" 
                             class="league-logo"
                             onerror="this.src='https://images.fotmob.com/image_resources/logo/leaguelogo/489.png'; this.closest('.league-info').setAttribute('data-logo-error', 'true')">
                    ` : ''}
                    <span class="league-name">${this.match.league}</span>
                    ${this.match.general?.matchRound ? `
                        <span class="league-name">Round ${this.match.general.matchRound}</span>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    getMatchStatus() {
        const status = this.match.header?.status;
        if (!status) return '';
        
        if (status.finished) {
            return 'Full Time';
        } else if (status.started) {
            return status.liveTime?.short || 'Live';
        } else {
            return 'Upcoming';
        }
    }
    
    setupEventListeners() {
        // Team clicks
        const teams = this.container.querySelectorAll('.team');
        teams.forEach(team => {
            team.addEventListener('click', () => {
                const teamId = team.getAttribute('data-team-id');
                if (teamId) {
                    this.onTeamClick(teamId);
                }
            });
        });
        
        // League click
        const leagueInfo = this.container.querySelector('.league-info.clickable');
        if (leagueInfo) {
            leagueInfo.addEventListener('click', () => {
                const leagueId = leagueInfo.getAttribute('data-league-id');
                if (leagueId) {
                    this.onLeagueClick(leagueId);
                }
            });
        }
    }
    
    destroy() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }
    
    updateTheme(newTheme) {
        this.theme = newTheme;
        this.render();
        this.setupEventListeners();
        if (this.isUpcomingMatch()) {
            this.startCountdown();
        }
    }
    
    updateMatch(newMatch) {
        this.match = newMatch;
        this.render();
        this.setupEventListeners();
        if (this.isUpcomingMatch()) {
            this.startCountdown();
        }
    }
}
