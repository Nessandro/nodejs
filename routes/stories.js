const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

/**
 * @desc    show add story form
 * @route   GET /add
 */

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

/**
 * @desc    show story
 * @route   GET /
 */

router.get('/:id', ensureAuth, (req, res) => {
    
    try{
        
    }catch (e) {
        
    }
    
   console.log(req.params);
   res.redirect('/')
})

/**
 * @desc    process add story
 * @route   POST /
 */
router.post('/', ensureAuth, async (req, res) => {

    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/')
    }catch (e) {
        console.error(e)
        res.render('error/500')
    }
})

module.exports = router;