const express = require('express');
const router = express.Router();
const educationService = require('../services/educationService');

/**
 * @route GET /api/education/tutorials
 * @desc Get all tutorials
 */
router.get('/tutorials', (req, res) => {
  try {
    const tutorials = educationService.getAllTutorials();
    res.json(tutorials);
  } catch (error) {
    console.error('Get tutorials error:', error);
    res.status(500).json({ error: 'Failed to get tutorials' });
  }
});

/**
 * @route GET /api/education/tutorials/:id
 * @desc Get tutorial by ID
 */
router.get('/tutorials/:id', (req, res) => {
  try {
    const tutorial = educationService.getTutorial(req.params.id);
    
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found' });
    }
    
    res.json(tutorial);
  } catch (error) {
    console.error('Get tutorial error:', error);
    res.status(500).json({ error: 'Failed to get tutorial' });
  }
});

/**
 * @route GET /api/education/case-studies
 * @desc Get all case studies
 */
router.get('/case-studies', (req, res) => {
  try {
    const caseStudies = educationService.getAllCaseStudies();
    res.json(caseStudies);
  } catch (error) {
    console.error('Get case studies error:', error);
    res.status(500).json({ error: 'Failed to get case studies' });
  }
});

/**
 * @route GET /api/education/case-studies/:id
 * @desc Get case study by ID
 */
router.get('/case-studies/:id', (req, res) => {
  try {
    const caseStudy = educationService.getCaseStudy(req.params.id);
    
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found' });
    }
    
    res.json(caseStudy);
  } catch (error) {
    console.error('Get case study error:', error);
    res.status(500).json({ error: 'Failed to get case study' });
  }
});

/**
 * @route POST /api/education/quiz/generate
 * @desc Generate a quiz
 */
router.post('/quiz/generate', (req, res) => {
  try {
    const { category, difficulty, count } = req.body;
    const quiz = educationService.generateQuiz({ category, difficulty, count });
    res.json(quiz);
  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

/**
 * @route POST /api/education/quiz/submit
 * @desc Submit quiz answers
 */
router.post('/quiz/submit', (req, res) => {
  try {
    const { quizId, answers, userId } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }
    
    const result = educationService.submitQuiz(quizId, answers, userId);
    res.json(result);
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

/**
 * @route GET /api/education/progress/:userId
 * @desc Get user's learning progress
 */
router.get('/progress/:userId', (req, res) => {
  try {
    const progress = educationService.getUserProgress(req.params.userId);
    res.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

/**
 * @route POST /api/education/tutorials/:id/complete
 * @desc Mark tutorial as completed
 */
router.post('/tutorials/:id/complete', (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const progress = educationService.completeTutorial(userId, req.params.id);
    res.json(progress);
  } catch (error) {
    console.error('Complete tutorial error:', error);
    res.status(500).json({ error: 'Failed to complete tutorial' });
  }
});

module.exports = router;
