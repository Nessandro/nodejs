const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')


/**
 * @desc    show all stories
 * @route   GET /stories/
 */

router.get('/', ensureAuth, async (req, res) => {
    try{
        const stories = await Story.find(
            {
                $or: [
                    { status: 'public' },
                    { user: req.user.id }
                ]
            }
            )
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()


        res.render('stories/index',{stories})
    }catch (e) {
        console.error(e);
        res.render('error/500')
    }

})

/**
 * @desc    show add story form
 * @route   GET /stories/add
 */

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

/**
 * @desc    show single story
 * @route   GET /stories/:id
 */

router.get('/:id', ensureAuth, async (req, res) => {
    try{
        const story = await Story.findById(req.params.id)
            .populate('user')
            .lean();

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id  && story.status !== 'public') {
            return res.render('error/403')
        }

        res.render('stories/read',{story})

    }catch (e) {
        console.error(e);
        res.render('error/500')
    }

})

/**
 * @desc    show edit story form
 * @route   GET /stories/edit/:id
 */

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try{
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            return res.render('error/403')
        }

        res.render('stories/edit', {
            story
        })
    }catch (e) {
        console.error(e);
        res.render('error/500')
    }
})

/**
 * @desc    process edit the story
 * @route   PUT /stories/edit/:id
 */

router.put('/edit/:id', ensureAuth, async (req, res) => {
    try{
        let story = await Story.findById(req.params.id).lean();

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            return res.render('error/403')
        }

        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true,
            runValidators: true
        });

        res.redirect('/dashboard')

    }catch (e) {
        console.error(e);
        res.render('error/500')
    }
})


/**
 * @desc    show story
 * @route   DELETE /stories/:id
 */

router.delete('/:id', ensureAuth, async (req, res) => {
    try{
        let story = await Story.findById(req.params.id).lean();

        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            return res.render('error/403')
        }

        story = await Story.findOneAndDelete({_id: req.params.id});

        res.redirect('/dashboard')

    }catch (e) {
        console.error(e);
        res.render('error/500')
    }

})

/**
 * @desc    process add story
 * @route   POST /stories/
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