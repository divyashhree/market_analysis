const cacheService = require('./cacheService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * Education Service
 * Provides interactive tutorials, quizzes, and case studies
 */
class EducationService {
  constructor() {
    this.userProgress = new Map();
    
    // Interactive tutorials
    this.tutorials = [
      {
        id: 'inflation-basics',
        title: 'Understanding Inflation',
        category: 'fundamentals',
        difficulty: 'beginner',
        duration: '10 min',
        icon: '📈',
        chapters: [
          {
            id: 1,
            title: 'What is Inflation?',
            content: `Inflation is the rate at which the general level of prices for goods and services rises, causing purchasing power to fall. In India, it's measured primarily by:
            
• **CPI (Consumer Price Index)**: Measures price changes for a basket of consumer goods
• **WPI (Wholesale Price Index)**: Tracks wholesale price changes

**Example**: If inflation is 6%, something costing ₹100 today will cost ₹106 next year.`,
            visualData: {
              type: 'line',
              title: 'India CPI Inflation (2014-2024)',
            },
          },
          {
            id: 2,
            title: 'Types of Inflation',
            content: `**Demand-Pull Inflation**: Too much money chasing too few goods
**Cost-Push Inflation**: Rising production costs push prices up
**Built-In Inflation**: Workers expect prices to rise, demand higher wages

**India Context**: Food inflation often drives overall CPI due to monsoon dependency.`,
          },
          {
            id: 3,
            title: 'Impact on Markets',
            content: `**On Stocks (NIFTY)**:
• High inflation → RBI raises rates → Stocks fall
• Historical correlation: -0.3 to -0.5

**On Currency (INR)**:
• High inflation → Currency weakens
• Makes imports expensive

**On Bonds**:
• High inflation → Bond prices fall
• Real returns become negative`,
            visualData: {
              type: 'correlation',
              pairs: ['CPI-NIFTY', 'CPI-USDINR'],
            },
          },
        ],
        quiz: [
          {
            question: 'If CPI inflation is 7% and your FD gives 6% return, what is your real return?',
            options: ['+1%', '-1%', '+7%', '+6%'],
            correct: 1,
            explanation: 'Real return = Nominal return - Inflation = 6% - 7% = -1%',
          },
          {
            question: 'Which sector typically benefits during high inflation?',
            options: ['IT Services', 'Real Estate', 'Gold/Commodities', 'Banks'],
            correct: 2,
            explanation: 'Gold and commodities are traditional inflation hedges.',
          },
        ],
      },
      {
        id: 'correlation-analysis',
        title: 'Market Correlations',
        category: 'analysis',
        difficulty: 'intermediate',
        duration: '15 min',
        icon: '🔗',
        chapters: [
          {
            id: 1,
            title: 'What is Correlation?',
            content: `Correlation measures how two variables move together:

• **+1**: Perfect positive correlation (move together)
• **0**: No correlation (independent)
• **-1**: Perfect negative correlation (move opposite)

**Why it matters**: Understanding correlations helps in:
• Portfolio diversification
• Risk management
• Predicting market movements`,
            visualData: {
              type: 'scatter',
              title: 'CPI vs NIFTY Correlation',
            },
          },
          {
            id: 2,
            title: 'Key Indian Market Correlations',
            content: `**CPI ↔ NIFTY**: Negative (-0.3 to -0.5)
Higher inflation → Market stress

**USD/INR ↔ NIFTY**: Negative (-0.4)
Rupee weakness → FII outflows → Market falls

**Oil ↔ INR**: Negative (-0.6)
India imports 85% oil → Higher oil = Weaker rupee

**US Markets ↔ NIFTY**: Positive (+0.7)
Global risk sentiment affects Indian markets`,
          },
        ],
        quiz: [
          {
            question: 'A correlation of -0.7 between two assets means:',
            options: [
              'They always move together',
              'They have no relationship',
              'They tend to move in opposite directions',
              'One causes the other',
            ],
            correct: 2,
            explanation: 'Negative correlation means inverse relationship - when one goes up, the other tends to go down.',
          },
        ],
      },
      {
        id: 'rbi-policy',
        title: 'RBI Monetary Policy',
        category: 'india-specific',
        difficulty: 'intermediate',
        duration: '20 min',
        icon: '🏦',
        chapters: [
          {
            id: 1,
            title: 'RBI\'s Mandate',
            content: `The Reserve Bank of India has multiple objectives:

**Primary**: Price Stability (Inflation targeting 4% ± 2%)
**Secondary**: Growth support, Financial stability

**Key Tools**:
• Repo Rate: Rate at which RBI lends to banks
• Reverse Repo: Rate at which RBI borrows from banks
• CRR: Cash Reserve Ratio
• SLR: Statutory Liquidity Ratio`,
          },
          {
            id: 2,
            title: 'How Rate Changes Affect Markets',
            content: `**Rate Hike (+25 bps)**:
• Bank stocks: +2-3% (higher NIM)
• Real estate: -3-5% (higher EMIs)
• Auto: -2-3% (costlier loans)
• NBFCs: -3-4% (funding costs rise)

**Rate Cut (-25 bps)**:
• Opposite effects
• Growth stocks benefit
• Real estate rallies`,
            visualData: {
              type: 'impact',
              event: 'RBI Rate Decision',
            },
          },
        ],
        quiz: [
          {
            question: 'RBI raises repo rate by 50 bps. Which sector is likely to benefit?',
            options: ['Real Estate', 'Banking', 'Auto', 'NBFC'],
            correct: 1,
            explanation: 'Banks benefit from rate hikes as their Net Interest Margins (NIM) expand.',
          },
        ],
      },
      {
        id: 'budget-analysis',
        title: 'Union Budget Impact',
        category: 'india-specific',
        difficulty: 'advanced',
        duration: '25 min',
        icon: '📜',
        chapters: [
          {
            id: 1,
            title: 'Budget Components',
            content: `**Revenue Budget**: Day-to-day expenses
**Capital Budget**: Long-term investments

**Key Numbers to Watch**:
• Fiscal Deficit (target: <4.5% of GDP)
• Capital Expenditure (infra spending)
• Tax revenue targets
• Disinvestment targets`,
          },
          {
            id: 2,
            title: 'Sector-wise Budget Plays',
            content: `**If Capex increases**:
• Infrastructure: +5-8%
• Cement: +4-6%
• Steel: +3-5%
• L&T, UltraTech benefit

**If Income tax cut**:
• FMCG: +3-4%
• Auto: +2-3%
• Discretionary consumption up

**If Fiscal deficit widens**:
• Bond yields rise
• Rate-sensitive stocks fall`,
          },
        ],
        quiz: [
          {
            question: 'Government announces 30% increase in infrastructure capex. Which stock benefits most?',
            options: ['TCS', 'HDFC Bank', 'L&T', 'Sun Pharma'],
            correct: 2,
            explanation: 'L&T is a direct beneficiary of infrastructure spending as a major EPC contractor.',
          },
        ],
      },
    ];

    // Historical case studies
    this.caseStudies = [
      {
        id: 'demonetization-2016',
        title: 'Demonetization (Nov 2016)',
        icon: '💵',
        date: '2016-11-08',
        summary: 'PM Modi announced ₹500 and ₹1000 notes invalid overnight',
        impact: {
          nifty: { immediate: -6.3, '1month': -4.2, '3month': +5.8 },
          sectors: {
            'Banking': { impact: -8, reason: 'Cash crunch, but later benefited from deposits' },
            'Real Estate': { impact: -15, reason: 'Cash-based transactions halted' },
            'FMCG': { impact: -5, reason: 'Rural demand hit' },
            'Digital Payments': { impact: +40, reason: 'Paytm, etc. surged' },
          },
        },
        lessons: [
          'Black swan events create buying opportunities',
          'Digitization beneficiaries emerged as multi-baggers',
          'Real estate took 2+ years to recover',
        ],
        timeline: [
          { date: '2016-11-08', event: 'Announcement at 8 PM' },
          { date: '2016-11-09', event: 'NIFTY falls 6%' },
          { date: '2016-11-14', event: 'Banking stocks start recovering' },
          { date: '2017-03', event: 'Markets hit new highs' },
        ],
      },
      {
        id: 'covid-crash-2020',
        title: 'COVID Crash (Mar 2020)',
        icon: '🦠',
        date: '2020-03-23',
        summary: 'Global pandemic caused fastest market crash in history',
        impact: {
          nifty: { immediate: -38, '1month': +20, '1year': +85 },
          sectors: {
            'Pharma': { impact: +35, reason: 'Healthcare demand surge' },
            'IT': { impact: +60, reason: 'Digital transformation' },
            'Aviation': { impact: -70, reason: 'Travel ban' },
            'Hotels': { impact: -65, reason: 'Tourism halt' },
          },
        },
        lessons: [
          'Extreme fear = Extreme opportunity',
          'Quality stocks recover fastest',
          'Structural trends accelerate in crisis (digital, pharma)',
        ],
        timeline: [
          { date: '2020-01-30', event: 'First COVID case in India' },
          { date: '2020-03-23', event: 'NIFTY hits 7511 (bottom)' },
          { date: '2020-03-24', event: 'Lockdown announced' },
          { date: '2020-11', event: 'NIFTY crosses pre-COVID high' },
        ],
      },
      {
        id: 'taper-tantrum-2013',
        title: 'Taper Tantrum (2013)',
        icon: '📉',
        date: '2013-05-22',
        summary: 'Fed hints at reducing QE, emerging markets crash',
        impact: {
          nifty: { immediate: -9, '3month': -12, '1year': +18 },
          usdinr: { immediate: +15, reason: 'Rupee fell from 54 to 68' },
          sectors: {
            'IT': { impact: +15, reason: 'Rupee depreciation benefit' },
            'Import-heavy': { impact: -20, reason: 'Higher costs' },
          },
        },
        lessons: [
          'Fed policy impacts EM markets heavily',
          'Currency hedging is crucial',
          'IT/Pharma act as defensive plays',
        ],
      },
      {
        id: 'nbfc-crisis-2018',
        title: 'IL&FS / NBFC Crisis (2018)',
        icon: '🏢',
        date: '2018-09-21',
        summary: 'IL&FS default triggered liquidity crisis in NBFC sector',
        impact: {
          nifty: { immediate: -11, '6month': -5 },
          sectors: {
            'NBFC': { impact: -40, reason: 'Funding dried up' },
            'Real Estate': { impact: -30, reason: 'Credit squeeze' },
            'Banking': { impact: -15, reason: 'NPA concerns' },
          },
        },
        lessons: [
          'Leverage is a double-edged sword',
          'Liquidity risk can escalate quickly',
          'Quality NBFCs (Bajaj Finance) recovered fastest',
        ],
      },
    ];

    // Quiz questions bank
    this.quizQuestions = [
      {
        id: 1,
        category: 'inflation',
        difficulty: 'easy',
        question: 'What does CPI stand for?',
        options: ['Consumer Price Index', 'Central Price Index', 'Common Price Indicator', 'Current Price Index'],
        correct: 0,
      },
      {
        id: 2,
        category: 'rbi',
        difficulty: 'medium',
        question: 'RBI\'s inflation target is:',
        options: ['2% ± 1%', '4% ± 2%', '6% ± 2%', '5% ± 1%'],
        correct: 1,
      },
      {
        id: 3,
        category: 'markets',
        difficulty: 'medium',
        question: 'When FIIs sell heavily, what typically happens to INR?',
        options: ['Appreciates', 'Depreciates', 'No change', 'Becomes volatile'],
        correct: 1,
      },
      {
        id: 4,
        category: 'correlation',
        difficulty: 'hard',
        question: 'Historical correlation between Brent crude and INR is approximately:',
        options: ['+0.6', '-0.6', '0', '+0.9'],
        correct: 1,
      },
      {
        id: 5,
        category: 'sectors',
        difficulty: 'medium',
        question: 'Which sector is most sensitive to interest rate changes?',
        options: ['IT', 'Pharma', 'Real Estate', 'FMCG'],
        correct: 2,
      },
    ];
  }

  /**
   * Get all tutorials
   */
  getAllTutorials() {
    return this.tutorials.map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      difficulty: t.difficulty,
      duration: t.duration,
      icon: t.icon,
      chaptersCount: t.chapters.length,
      hasQuiz: t.quiz && t.quiz.length > 0,
    }));
  }

  /**
   * Get tutorial by ID
   */
  getTutorial(id) {
    return this.tutorials.find(t => t.id === id) || null;
  }

  /**
   * Get all case studies
   */
  getAllCaseStudies() {
    return this.caseStudies.map(c => ({
      id: c.id,
      title: c.title,
      icon: c.icon,
      date: c.date,
      summary: c.summary,
    }));
  }

  /**
   * Get case study by ID
   */
  getCaseStudy(id) {
    return this.caseStudies.find(c => c.id === id) || null;
  }

  /**
   * Generate a quiz
   */
  generateQuiz(options = {}) {
    const { category, difficulty, count = 5 } = options;
    
    let questions = [...this.quizQuestions];
    
    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    // Shuffle and pick
    questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
    
    return {
      id: uuidv4(),
      questions: questions.map(q => ({
        ...q,
        correct: undefined, // Don't send correct answer
      })),
      totalQuestions: questions.length,
      timeLimit: count * 30, // 30 seconds per question
    };
  }

  /**
   * Submit quiz answers
   */
  submitQuiz(quizId, answers, userId) {
    let score = 0;
    const results = [];
    
    answers.forEach(({ questionId, answer }) => {
      const question = this.quizQuestions.find(q => q.id === questionId);
      if (question) {
        const isCorrect = question.correct === answer;
        if (isCorrect) score++;
        results.push({
          questionId,
          isCorrect,
          correctAnswer: question.correct,
          explanation: question.explanation || '',
        });
      }
    });
    
    const percentage = (score / answers.length) * 100;
    
    // Update user progress
    if (userId) {
      const progress = this.userProgress.get(userId) || { quizzesTaken: 0, totalScore: 0 };
      progress.quizzesTaken++;
      progress.totalScore += percentage;
      progress.lastQuizDate = new Date().toISOString();
      this.userProgress.set(userId, progress);
    }
    
    return {
      score,
      total: answers.length,
      percentage: percentage.toFixed(1),
      grade: percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D',
      results,
      badge: percentage === 100 ? '🏆 Perfect Score!' : percentage >= 80 ? '🌟 Excellent!' : null,
    };
  }

  /**
   * Get user progress
   */
  getUserProgress(userId) {
    return this.userProgress.get(userId) || {
      quizzesTaken: 0,
      totalScore: 0,
      tutorialsCompleted: [],
      badges: [],
    };
  }

  /**
   * Mark tutorial as completed
   */
  completeTutorial(userId, tutorialId) {
    const progress = this.userProgress.get(userId) || {
      quizzesTaken: 0,
      totalScore: 0,
      tutorialsCompleted: [],
      badges: [],
    };
    
    if (!progress.tutorialsCompleted.includes(tutorialId)) {
      progress.tutorialsCompleted.push(tutorialId);
      
      // Award badge
      if (progress.tutorialsCompleted.length === 1) {
        progress.badges.push({ id: 'first-tutorial', name: '📚 First Steps', date: new Date().toISOString() });
      }
      if (progress.tutorialsCompleted.length === 5) {
        progress.badges.push({ id: 'dedicated-learner', name: '🎓 Dedicated Learner', date: new Date().toISOString() });
      }
    }
    
    this.userProgress.set(userId, progress);
    return progress;
  }
}

module.exports = new EducationService();
